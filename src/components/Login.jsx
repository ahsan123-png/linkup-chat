import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username.trim() && password.trim()) {
      login(username);
      navigate('/chat');
    } else {
      alert('Please fill all fields');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      {/* Login Card Box */}
      <div className="bg-[#333333] rounded shadow-lg grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl overflow-hidden h-5/6">
        {/* Left side - Image */}
        <div className="hidden md:block">
          <img
            src="src\img\login.jpg"
            alt="Login Visual"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right side - Form */}
        <div className="p-8 flex items-center justify-center">
          <form onSubmit={handleLogin} className="w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-6 text-center text-white">
              Login to ChatApp
            </h2>

            <input
              className="w-full border px-3 py-2 mb-4 rounded outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              className="w-full border px-3 py-2 mb-4 rounded outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-[#4CAF50] text-white py-2 rounded hover:bg-green-700 transition"
            >
              Login
            </button>

            <p className="text-sm mt-4 text-center text-white">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#4CAF50] hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
