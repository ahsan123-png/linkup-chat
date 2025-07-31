import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const access = localStorage.getItem('accessToken');
    return access ? jwtDecode(access) : null;
  });

  const login = async (username, password) => {
    try {
      const payload = { username_or_email_or_phone:username, password:password };
      console.log('Sending login payload:', payload);

      const response = await fetch('http://127.0.0.1:8000/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Login response status:', response.status);

      const data = await response.json();
      console.log('Login response data:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      localStorage.setItem('accessToken', data.tokens.access);
      localStorage.setItem('refreshToken', data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUser(jwtDecode(data.tokens.access));

      return true;
    } catch (error) {
      console.error('Login error:', error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshAccessToken = async () => {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) return logout();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });

      if (!response.ok) throw new Error('Refresh failed');

      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      setUser(jwtDecode(data.access));
      return data.access;
    } catch (err) {
      logout();
    }
  };

  // Optional: Auto-refresh token every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const { exp } = jwtDecode(token);
        if (Date.now() >= exp * 1000) {
          refreshAccessToken();
        }
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
