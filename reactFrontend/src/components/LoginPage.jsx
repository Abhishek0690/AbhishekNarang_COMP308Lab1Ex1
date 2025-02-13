import React, { useState } from 'react';
import axios from 'axios';
import api from '../config/api';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const params = { email, password };
      const response = await api.post('/login', params);
  
      console.log("Login successful:", response.data);
  
      if (response.status === 200) {
        // Store the token in localStorage after successful login
        localStorage.setItem("token", response.data.token);
        onLogin(response.data.user);  // Send the user data to App.jsx
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error("Login error:", err);
    }
  };  

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginPage;
