import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    console.log('Checking admin for user:', user);
    if (!user) return false;
    if (!user.roles) return false;
    return user.roles?.some(role => 
      role.role?.name === 'admin' || role.name === 'admin'
    );
  };

  // Check if user has a specific role
  const hasRole = (roleName) => {
    if (!user) return false;
    return user.roles?.some(role => 
      role.role?.name === roleName || role.name === roleName
    );
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin,
    hasRole,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
