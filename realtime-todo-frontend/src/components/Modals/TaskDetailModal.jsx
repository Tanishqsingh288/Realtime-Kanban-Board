import React, { useEffect } from 'react';
import '../../styles/taskdetailmodal.css';

const TaskDetailModal = ({ task, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="task-detail-backdrop" onClick={onClose}>
      <div className="task-detail-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{task.title}</h3>
        <p><strong>Description:</strong> {task.description || 'No description'}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Assigned User:</strong> {task.assignedUser?.username || 'Unassigned'}</p>
        <p><strong>Last Modified:</strong> {new Date(task.lastModified).toLocaleString()}</p>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TaskDetailModal;
