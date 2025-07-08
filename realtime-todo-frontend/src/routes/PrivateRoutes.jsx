// src/routes/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    console.warn('[PrivateRoute] No token → redirecting to /login');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
