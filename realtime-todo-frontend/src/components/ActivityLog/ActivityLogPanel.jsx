import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../contexts/SocketContext';
import { AuthContext } from '../../contexts/AuthContext';
import LogBox from '../Kanban/Logbox';
import '../../styles/logbox.css';

const BASE_API = process.env.REACT_APP_BASE_API ||"https://realtime-kanban-board-production.up.railway.app";

const ActivityLogPanel = () => {
  const { socket } = useContext(SocketContext);
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [actions, setActions] = useState([]);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const res = await fetch(`${BASE_API}/api/actions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          console.warn('[ActivityLogPanel] 401 Unauthorized. Logging out...');
          logout();
          navigate('/');
          return;
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setActions(data);
        } else if (Array.isArray(data.actions)) {
          setActions(data.actions);
        } else {
          console.warn('[ActivityLogPanel] Unexpected response:', data);
          setActions([]);
        }
      } catch (err) {
        console.error(err);
        setActions([]);
      }
    };

    if (token) fetchActions();
  }, [token, navigate, logout]);

  useEffect(() => {
    if (!socket) return;

    const handleNewAction = (action) => {
      setActions((prev) => {
        const updated = [action, ...prev];
        return updated.slice(0, 20);
      });
    };

    socket.on('action_logged', handleNewAction);
    return () => {
      socket.off('action_logged', handleNewAction);
    };
  }, [socket]);

  return (
    <div className="activity-log">
      <h3 className="log-title">Activity Log</h3>
      {Array.isArray(actions) && actions.length === 0 ? (
        <p>No recent actions</p>
      ) : Array.isArray(actions) ? (
        actions.map((log, idx) => (
          <LogBox key={log._id || idx} log={log} />
        ))
      ) : (
        <p>Loading logs...</p>
      )}
    </div>
  );
};

export default ActivityLogPanel;
