import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      alert('Please fill all fields');
      return;
    }

    const payload = {
      full_name: fullName,
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));

        login(fullName); // or data.user.full_name
        navigate('/chat');
      } else {
        const errorData = await response.json();
        alert('Registration failed: ' + (errorData.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error occurred:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-950">
      {/* Form Box with Grid inside */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* Left side image */}
        <div className="hidden md:block">
          <img
            src="src\img\register.jpg"
            alt="Register Visual"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right side form */}
        <div className="p-8 flex items-center justify-center bg-[#1f1f1f]">
          <form onSubmit={handleRegister} className="w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-6 text-center text-white">
              Create Your Account
            </h2>

            <input
              className="w-full border px-3 py-2 mb-4 rounded outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              type="email"
              className="w-full border px-3 py-2 mb-4 rounded outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Register
            </button>

            <p className="text-sm mt-4 text-center text-white">
              Already have an account?{' '}
              <Link to="/login" className="text-green-400 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
