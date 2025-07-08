import React from 'react';
import '../../styles/authpopup.css';

const AuthPopup = ({ onConfirm }) => {
  return (
    <div
      className="auth-popup-overlay"
      aria-modal="true"
      role="dialog"
      aria-labelledby="auth-popup-title"
      aria-describedby="auth-popup-desc"
    >
      <div className="auth-popup">
        <h3 id="auth-popup-title">🔒 Session Expired</h3>
        <p id="auth-popup-desc">
          Your session has expired or is unauthorized. Please login again.
        </p>
        <button className="auth-popup-btn" onClick={onConfirm}>
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default AuthPopup;
