import React, { useContext, useState } from 'react';
import { SocketContext } from '../../contexts/SocketContext';
import { AuthContext } from '../../contexts/AuthContext';
import ConflictModal from '../Modals/ConflictModal';
import TaskDetailModal from '../Modals/TaskDetailModal';
import TaskEditModal from '../Modals/TaskEditModal';
import '../../styles/taskcard.css';

const TaskCard = ({ task, provided, snapshot }) => {
  const { socket } = useContext(SocketContext);
  const { token } = useContext(AuthContext);

  const [conflict, setConflict] = useState({
    show: false,
    serverVersion: null,
    clientVersion: null,
  });

  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [assignMessage, setAssignMessage] = useState('');

const API_URL = process.env.REACT_APP_BASE_API ||"https://realtime-kanban-board-production.up.railway.app";

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    if (!token) {
      alert('You must be logged in to delete tasks.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/tasks/${task._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete task');
      }

      console.log(`✅ Task deleted: ${data.message}`);
    } catch (err) {
      console.error('❌ Delete failed:', err);
      alert(err.message);
    }
  };

  const handleSmartAssign = async () => {
    if (!token) {
      alert('You must be logged in to smart assign.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/tasks/${task._id}/smart-assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Smart Assign failed');
      }

      const userName = data.assignedUser?.username || 'Unknown User';

      setAssignMessage(`✅ Task assigned to ${userName} & moved to In Progress`);
      setTimeout(() => setAssignMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert(`Smart Assign failed: ${err.message}`);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowEditModal(true);
  };

  const handleConflictResolve = (choice) => {
    const resolvedTask =
      choice === 'client' ? conflict.clientVersion : conflict.serverVersion;

    socket.emit('update_task', resolvedTask);
    setConflict({ show: false, serverVersion: null, clientVersion: null });
  };

  return (
    <>
      <div
        className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={() => setShowDetails(true)}
      >
        <h4 className="task-title">{task.title}</h4>
        <p className="task-desc">
          {task.description}
          {task.description.length > 100 && (
            <span
              style={{
                color: '#6366f1',
                marginLeft: '4px',
                fontWeight: '600',
              }}
            >
              See more
            </span>
          )}
        </p>

        <p className="task-user">
          Assigned to: {task.assignedUser?.username || 'Unassigned'}
        </p>

        <div className="task-actions" onClick={(e) => e.stopPropagation()}>
          <button className="edit-btn" onClick={handleEdit}>
            Edit
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            Delete
          </button>

          {task.status === 'Todo' && (
            <button className="smart-assign-btn" onClick={handleSmartAssign}>
              🤖 Smart Assign
            </button>
          )}
        </div>

        {assignMessage && <p className="smart-assign-msg">{assignMessage}</p>}
      </div>

      {showEditModal && (
        <TaskEditModal
          task={task}
          onClose={() => setShowEditModal(false)}
          setConflict={setConflict}
        />
      )}

      {conflict.show && (
        <ConflictModal
          serverTask={conflict.serverVersion}
          clientTask={conflict.clientVersion}
          onResolve={handleConflictResolve}
        />
      )}

      {showDetails && (
        <TaskDetailModal task={task} onClose={() => setShowDetails(false)} />
      )}
    </>
  );
};

export default TaskCard;
