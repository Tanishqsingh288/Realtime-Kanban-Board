import React from 'react';
import '../../styles/logbox.css';

const LogBox = ({ log }) => {
  return (
    <div className={`log-box log-${log.actionType}`}>
      <p>
        <strong>{log.user?.username || 'Unknown User'}</strong>{' '}
        <span className="log-action">{log.actionType.toUpperCase()}</span>{' '}
        <span>task</span>{' '}
        <strong>
          {log.task?.title || log.metadata?.deletedTitle || 'Unknown Task'}
        </strong>
      </p>
      <span className="log-time">
        {new Date(log.timestamp).toLocaleString()}
      </span>
    </div>
  );
};

export default LogBox;
