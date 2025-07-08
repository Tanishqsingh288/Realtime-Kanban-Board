import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../contexts/SocketContext';
import { AuthContext } from '../../contexts/AuthContext';
import { DragDropContext } from '@hello-pangea/dnd';

import Column from './Column';
import NewTaskForm from './NewTaskForm';
import ActivityLogPanel from '../ActivityLog/ActivityLogPanel';
import Loader from '../Shared/Loader';
import '../../styles/board.css';

const API_URL = process.env.REACT_APP_BASE_API ||"https://realtime-kanban-board-production.up.railway.app";

const KanbanBoard = () => {
  const { socket } = useContext(SocketContext);
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          logout();
          navigate('/');
          return;
        }

        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);

      } catch (err) {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token, navigate, logout]);

  useEffect(() => {
    if (!socket) return;

    const handleTaskCreated = (task) => {
      setTasks((prev) => [task, ...prev]);
    };

    const handleTaskUpdated = (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    };

    const handleTaskDeleted = ({ taskId }) => {
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    };

    socket.on('task_created', handleTaskCreated);
    socket.on('task_updated', handleTaskUpdated);
    socket.on('task_deleted', handleTaskDeleted);

    return () => {
      socket.off('task_created', handleTaskCreated);
      socket.off('task_updated', handleTaskUpdated);
      socket.off('task_deleted', handleTaskDeleted);
    };
  }, [socket]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination, source } = result;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const movedTaskId = draggableId;
    const newStatus = destination.droppableId;

    const originalTask = tasks.find((task) => task._id === movedTaskId);
    if (!originalTask) return;

    const shouldAssign = newStatus === 'In Progress' && !originalTask.assignedUser;

    const updatedTask = {
      ...originalTask,
      status: newStatus,
      assignedUser: shouldAssign ? user._id : (newStatus === 'Todo' ? null : originalTask.assignedUser),
    };

    setTasks((prev) =>
      prev.map((task) =>
        task._id === movedTaskId ? updatedTask : task
      )
    );

    socket.emit('update_task_status', {
      taskId: movedTaskId,
      newStatus,
      draggingUser: { _id: user._id },
    });
  };

  const statuses = ['Todo', 'In Progress', 'Done'];

  if (loading) return <Loader size={50} />;

  return (
    <div className="kanban-container">
      <h2 className="board-title">Your Kanban Board</h2>
      <NewTaskForm />
      <div className="board-wrapper">
        <DragDropContext onDragEnd={handleDragEnd}>
          {statuses.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={tasks.filter((task) => task.status === status)}
            />
          ))}
        </DragDropContext>
        <ActivityLogPanel />
      </div>
    </div>
  );
};

export default KanbanBoard;
