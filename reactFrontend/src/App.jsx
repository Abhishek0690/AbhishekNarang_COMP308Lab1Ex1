import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import { ToastContainer } from 'react-toastify';


function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        navigate(userData.role === 'admin' ? '/admin' : '/student');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('User data:', userData.role);
    setUser(userData);
    navigate(userData.role === 'admin' ? '/admin' : '/student');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/student" element={<StudentDashboard user={user} onLogout={handleLogout} />} />
        <Route path="/admin" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
      </Routes>
    
  );
}



export default App;
