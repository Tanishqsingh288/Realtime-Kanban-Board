import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/auth.css';

const API_URL = process.env.REACT_APP_BASE_API ||"https://realtime-kanban-board-production.up.railway.app";

const Auth = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';

    const payload = isLoginMode
      ? { email, password }
      : { username, email, password };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }

      if (isLoginMode) {
        const userData = {
          _id: data._id,
          username: data.username,
          email: data.email
        };
        login(userData, data.token);
        navigate('/board');
      } else {
        alert('Registration successful! Please log in.');
        toggleMode();
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLoginMode ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {!isLoginMode && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : isLoginMode ? 'Login' : 'Register'}
        </button>

        {error && <p className="error-msg">{error}</p>}

        <p className="toggle-link">
          {isLoginMode
            ? "Don't have an account?"
            : 'Already have an account?'}{' '}
          <span onClick={toggleMode}>
            {isLoginMode ? 'Register' : 'Login'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Auth;
