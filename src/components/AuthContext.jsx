// -------------------------------
// src/AuthContext.jsx
// -------------------------------
import { createContext, useContext, useState, useEffect } from 'react';

// Create AuthContext to manage global login state
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage if available
    return localStorage.getItem('chatUser') || null;
  });

  // Log in user and persist in localStorage
  const login = (username) => {
    localStorage.setItem('chatUser', username);
    setUser(username);
  };

  // Log out user and clear localStorage
  const logout = () => {
    localStorage.removeItem('chatUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming AuthContext
export const useAuth = () => useContext(AuthContext);