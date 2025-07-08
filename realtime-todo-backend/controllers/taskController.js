const Task = require('../models/Task');
const ActionLog = require('../models/ActionLog');
const User = require('../models/User');

let io = null;

exports.setIO = (ioInstance) => {
  if (!ioInstance) {
    throw new Error('Invalid Socket.IO instance provided');
  }
  io = ioInstance;
  console.log('[Socket.IO] Controller initialized with IO instance');
};

const checkIO = () => {
  if (!io) {
    console.error('[FATAL] Socket.IO instance not initialized');
    throw new Error('Real-time service unavailable');
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .populate('assignedUser', 'username email');

    res.status(200).json(Array.isArray(tasks) ? tasks : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

exports.createTask = async (req, res) => {
  try {
    checkIO();
    const { title, description, assignedUser, status, priority } = req.body;

    if (['Todo', 'In Progress', 'Done'].includes(title)) {
      return res.status(400).json({ message: 'Invalid task title' });
    }

    const existingTask = await Task.findOne({ title });
    if (existingTask) {
      return res.status(409).json({ message: 'Task title exists' });
    }

    const newTask = await Task.create({
      title,
      description,
      assignedUser,
      status: status || 'Todo',
      priority: priority || 'Medium'
    });

    await newTask.populate('assignedUser', 'username email');

    const log = await ActionLog.create({
      user: req.user.userId,
      actionType: 'create',
      task: newTask._id
    });

    const populatedLog = await ActionLog.populate(log, [
      { path: 'user', select: 'username' },
      { path: 'task', select: 'title' }
    ]);

    io.emit('task_created', newTask);
    io.emit('action_logged', populatedLog);

    res.status(201).json(newTask);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Task creation failed' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    checkIO();
    const { id } = req.params;
    const { title, description, assignedUser, status, priority, lastModified } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (new Date(lastModified) < new Date(task.lastModified)) {
      return res.status(409).json({ message: 'Conflict detected', serverVersion: task });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedUser = assignedUser ?? task.assignedUser;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.lastModified = new Date();

    await task.save();

    const log = await ActionLog.create({
      user: req.user.userId,
      actionType: 'update',
      task: task._id
    });

    await log.populate([
      { path: 'user', select: 'username' },
      { path: 'task', select: 'title' }
    ]);

    io.emit('task_updated', task);
    io.emit('action_logged', log);

    res.status(200).json(task);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Task update failed' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    checkIO();
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const deletedTitle = task.title;

    await task.deleteOne();

    const log = await ActionLog.create({
      user: req.user.userId,
      actionType: 'delete',
      task: task._id,
      metadata: { deletedTitle }
    });

    await log.populate({ path: 'user', select: 'username' });

    io.emit('task_deleted', { taskId: id });
    io.emit('action_logged', log);

    res.status(200).json({ message: 'Task deleted' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Task deletion failed' });
  }
};

exports.smartAssign = async (req, res) => {
  try {
    checkIO();
    const { id } = req.params;

    const eligibleUsers = await User.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'assignedUser',
          as: 'tasks'
        }
      },
      {
        $addFields: {
          taskCount: {
            $size: {
              $filter: {
                input: '$tasks',
                as: 'task',
                cond: { $in: ['$$task.status', ['Todo', 'In Progress']] }
              }
            }
          }
        }
      },
      { $sort: { taskCount: 1 } },
      { $limit: 1 }
    ]);

    if (!eligibleUsers.length) {
      return res.status(400).json({ message: 'No eligible users' });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      {
        assignedUser: eligibleUsers[0]._id,
        status: 'In Progress',
        lastModified: new Date()
      },
      { new: true }
    ).populate('assignedUser', 'username');

    const log = await ActionLog.create({
      user: req.user.userId,
      actionType: 'smart-assign',
      task: task._id
    });

    const populatedLog = await ActionLog.findById(log._id)
      .populate('user', 'username email')
      .populate('task', 'title');

    io.emit('task_updated', task);
    io.emit('action_logged', populatedLog);

    res.status(200).json(task);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Smart assign failed' });
  }
};

exports.updateTaskStatusFromSocket = async (payload, ack) => {
  try {
    checkIO();

    const { taskId, newStatus, draggingUser } = payload;

    const task = await Task.findById(taskId);
    if (!task) {
      console.error(`[Socket] Task ${taskId} not found`);
      return ack?.({ error: 'Task not found' });
    }

    const previousStatus = task.status;
    task.status = newStatus;
    task.lastModified = new Date();

    if (newStatus === 'In Progress' && !task.assignedUser) {
      task.assignedUser = draggingUser._id;
    } else if (newStatus === 'Todo') {
      task.assignedUser = null;
    }

    await task.save();
    await task.populate('assignedUser', 'username email');

    const log = await ActionLog.create({
      user: draggingUser._id,
      actionType: 'update',
      task: task._id,
      metadata: {
        statusChange: {
          from: previousStatus,
          to: newStatus,
        },
      },
    });

    const populatedLog = await ActionLog.findById(log._id)
      .populate('user', 'username')
      .populate('task', 'title');

    io.emit('task_updated', task);
    io.emit('action_logged', populatedLog);

    ack?.(task);

  } catch (err) {
    console.error(err);
    ack?.({ error: 'Task update failed' });
  }
};
