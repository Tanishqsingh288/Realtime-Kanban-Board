import React, { useState, useContext } from 'react';
import { SocketContext } from '../../contexts/SocketContext';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/newtask.css';

const API_URL = process.env.REACT_APP_BASE_API ||"https://realtime-kanban-board-production.up.railway.app";

const NewTaskForm = () => {
  const { socket } = useContext(SocketContext);
  const { token } = useContext(AuthContext);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
    setError('');
    setSuccess('');
  };

  const handleDiscard = () => {
    setTitle('');
    setDescription('');
    setPriority(1);
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          assignedUser: null,
          status: 'Todo',
          priority: parseInt(priority, 10)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create task');
      }

      console.log('[Frontend] Created task:', data);
      setSuccess('✅ Task created!');
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setPriority(1);
        setShowForm(false);
        setSuccess('');
      }, 1000);

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="new-task-form">
      {!showForm ? (
        <button className="toggle-btn" onClick={handleToggleForm}>
          + Create New Task
        </button>
      ) : (
        <form onSubmit={handleCreate} className="slide-down">
          <input
            type="text"
            placeholder="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            min="1"
            max="5"
            placeholder="Priority (1-5)"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          />

          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" className="discard-btn" onClick={handleDiscard}>
              Discard
            </button>
          </div>

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
        </form>
      )}
    </div>
  );
};

export default NewTaskForm;
