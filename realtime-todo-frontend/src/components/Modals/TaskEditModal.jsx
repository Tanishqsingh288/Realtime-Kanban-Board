import React, { useState, useContext } from 'react';
import { SocketContext } from '../../contexts/SocketContext';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/modal.css';

const TaskEditModal = ({ task, onClose }) => {
  const { socket } = useContext(SocketContext);
  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [error, setError] = useState('');

const API_URL = process.env.REACT_APP_BASE_API ||"https://realtime-kanban-board-production.up.railway.app";

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title cannot be empty.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          lastModified: task.lastModified, // ✅ For optimistic conflict detection
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          alert('Conflict detected. Please refresh and try again.');
        } else {
          throw new Error(data.message || 'Update failed.');
        }
      } else {
        console.log('✅ Task updated:', data);
        // The real-time update comes via the socket listener in KanbanBoard
        onClose();
      }

    } catch (err) {
      console.error('❌ Update failed:', err);
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Task</h3>

        <form onSubmit={handleSave}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {error && <p className="error-msg">{error}</p>}

          <div className="modal-actions">
            <button type="submit" className="save-btn">Update</button>
            <button type="button" className="discard-btn" onClick={onClose}>Discard</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
