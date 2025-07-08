import React, { createContext, useState, useEffect } from 'react';
import Loader from '../components/Shared/Loader'; // ✅ Adjust the path if needed

// Create the context
export const AuthContext = createContext();

// Create the provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // Stores user info
  const [token, setToken] = useState(null); // Stores JWT
  const [loading, setLoading] = useState(true);

  // ✅ On initial load, check localStorage for real saved token & user
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      setToken(null);
      setUser(null);
    }

    setLoading(false);
  }, []);

  // ✅ LOGIN handler
  const login = (userData, jwt) => {
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
  };

  // ✅ LOGOUT handler
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const contextValue = {
    user,
    token,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? <Loader size={60} /> : children}
    </AuthContext.Provider>
  );
};

