import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  // State variables to store form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  // Function to handle form submission
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form refresh on submit

    // Basic validation: check if all fields are filled
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      alert('Please fill all fields');
      return;
    }

    // Prepare the payload for the API
    const payload = {
      full_name: fullName,
      email: email,
      password: password,
    };

    try {
      // Send POST request to Django backend for registration
      const response = await fetch('http://127.0.0.1:8000/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indicate sending JSON
        },
        body: JSON.stringify(payload), // Convert JS object to JSON string
      });

      // If the request is successful (HTTP status 200–299)
      if (response.ok) {
        const data = await response.json(); // Convert response to JS object
        console.log('Registered:', data);

        // ✅ Store tokens in localStorage
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);

        // You can also store user info (optional)
        localStorage.setItem('user', JSON.stringify(data.user));

        alert('Account created successfully! Redirecting to login.');
        navigate('/login'); // Redirect user to login page
      } else {
        // If registration failed, show error message
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        alert('Registration failed: ' + (errorData.message || 'Please try again.'));
      }
    } catch (error) {
      // Handle network or server errors
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

        {/* Full Name input field */}
        <input
          className="w-full border px-3 py-2 mb-4 rounded outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        {/* Email input field */}
        <input
          type="email"
          className="w-full border px-3 py-2 mb-4 rounded outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password input field */}
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

        {/* Link to login page */}
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
