// -------------------------------
// src/pages/Login.jsx
// -------------------------------
import { useState } from 'react';
import { useAuth } from '../components/AuthContext';

export default function Login({ onSwitch }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username && password) {
      login(username); // log in directly (no real password check for now)
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-6">Login</h2>
        <input
          className="w-full border px-3 py-2 mb-4 rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full border px-3 py-2 mb-4 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>
        <p className="text-sm mt-4 text-center">
          Don't have an account?{' '}
          <span
            onClick={onSwitch}
            className="text-blue-600 cursor-pointer underline"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}