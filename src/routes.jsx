// here we are creating all the routes for the application with the help of react-router-dom
// src/routes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChatLayout from './components/ChatLayout';
import { useAuth } from './components/AuthContext';

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/chat" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/chat" />} />

      {/* Protected route for chat */}
      <Route path="/chat" element={user ? <ChatLayout /> : <Navigate to="/login" />} />

      {/* Fallback to /login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
