import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; // <-- Import AuthContext to handle frontend login

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth(); // <-- login from context

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate fields
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

        // Store tokens and user info
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Log the user in (frontend context)
        login(fullName); // or login(data.user.full_name) if returned

        // Redirect to chat
        navigate('/chat');
      } else {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        alert('Registration failed: ' + (errorData.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error occurred:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-6 text-center">Create Your Account</h2>

        {/* Full Name input */}
        <input
          className="w-full border px-3 py-2 mb-4 rounded outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        {/* Email input */}
        <input
          type="email"
          className="w-full border px-3 py-2 mb-4 rounded outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password input */}
        <input
          type="password"
          className="w-full border px-3 py-2 mb-4 rounded outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>

        {/* Link to login */}
        <p className="text-sm mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
