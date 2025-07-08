    // src/contexts/SocketContext.js
    import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
    import { io } from 'socket.io-client';
    import { AuthContext } from './AuthContext';

    export const SocketContext = createContext();

    const socketAPI = process.env.REACT_APP_SOCKET_URL || 'https://realtime-kanban-board-production.up.railway.app';

    export const SocketProvider = ({ children }) => {
      const { token, user } = useContext(AuthContext);
      const [socket, setSocket] = useState(null);
      const socketRef = React.useRef(null); // Use a ref to hold the socket instance

      // This useCallback should not depend on 'socket' state directly to avoid re-creation loops
      const disconnectSocket = useCallback(() => {
        if (socketRef.current) { // Use the ref here
          socketRef.current.disconnect();
          socketRef.current = null; // Clear the ref
          setSocket(null); // Clear the state
          console.log('⚡️ Socket.IO disconnected');
        }
      }, []); // No dependencies, this function is stable

      useEffect(() => {
        if (token && user) {
          // If a socket already exists from a previous render, disconnect it first
          if (socketRef.current) {
            disconnectSocket();
          }

          const newSocket = io(socketAPI, {
            auth: { token },
            transports: ['websocket'],
            reconnectionAttempts: 5,
          });

          socketRef.current = newSocket; // Store in ref
          setSocket(newSocket); // Store in state

          newSocket.on('connect', () => {
            console.log('✅ Socket.IO connected');
          });

          newSocket.on('connect_error', (err) => {
            console.error('❌ Socket.IO error:', err.message);
          });

          newSocket.on('disconnect', (reason) => {
            console.log('⚡️ Socket.IO disconnected:', reason);
          });
        } else {
          disconnectSocket();
        }

        // Cleanup function for useEffect
        return () => {
          disconnectSocket();
        };
      }, [token, user, disconnectSocket]); // disconnectSocket is now stable

      return (
        <SocketContext.Provider value={{ socket }}>
          {children}
        </SocketContext.Provider>
      );
    };
    