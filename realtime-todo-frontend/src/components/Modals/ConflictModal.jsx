import React from 'react';
import '../../styles/conflictmodal.css';

const ConflictModal = ({ serverTask, clientTask, onResolve }) => {
  return (
    <div className="conflict-modal-overlay">
      <div className="conflict-modal">
        <h3>⚡ Conflict Detected</h3>
        <p>
          Another user updated this task. Choose which version you want to keep:
        </p>

        <div className="conflict-versions">
          <div className="conflict-version">
            <h4>🔗 Server Version</h4>
            <p><strong>Title:</strong> {serverTask.title}</p>
            <p><strong>Description:</strong> {serverTask.description}</p>
            <p><strong>Assigned:</strong> {serverTask.assignedUser || 'Unassigned'}</p>
            <p><strong>Status:</strong> {serverTask.status}</p>
          </div>

          <div className="conflict-version">
            <h4>📝 Your Changes</h4>
            <p><strong>Title:</strong> {clientTask.title}</p>
            <p><strong>Description:</strong> {clientTask.description}</p>
            <p><strong>Assigned:</strong> {clientTask.assignedUser || 'Unassigned'}</p>
            <p><strong>Status:</strong> {clientTask.status}</p>
          </div>
        </div>

        <div className="conflict-actions">
          <button className="keep-btn" onClick={() => onResolve('client')}>
            ✅ Keep My Changes
          </button>
          <button className="keep-btn" onClick={() => onResolve('server')}>
            🔗 Keep Server Version
          </button>
          <button className="merge-btn" onClick={() => onResolve('merge')}>
            🪄 Merge Manually
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;
