import React, { useState, createContext, useContext, useEffect } from 'react';

// Create Authentication Context
const AuthContext = createContext(null);

// Mock user data - in a real app, this would be stored securely
const MOCK_USER = {
  username: 'admin',
  password: 'admin' // In a real app, this would be hashed
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (username, password) => {
    return new Promise((resolve, reject) => {
      // Simple authentication check
      if (username === MOCK_USER.username && password === MOCK_USER.password) {
        const user = { username, lastLogin: new Date() };
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Invalid username or password'));
      }
    });
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Authentication context value
  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
