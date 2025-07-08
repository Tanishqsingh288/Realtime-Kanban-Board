// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

import Auth from './components/Auth/Auth';
import KanbanBoard from './components/Kanban/KanbanBoard';
import Navbar from './components/Shared/Navbar';
import Loader from './components/Shared/Loader';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loader size={60} />;

  return (
    <>
      {user && <Navbar />}

      <Routes>
        {!user ? (
          <>
            <Route path="/" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/board" element={
              <PrivateRoute>
                <KanbanBoard />
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/board" />} />
          </>
        )}
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <AppRoutes />
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
