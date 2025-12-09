import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 shadow p-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-white">
        Welcome, {user?.name || 'User'}
      </h2>
      <button 
        onClick={handleLogout}
        className="px-4 py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-200 transition-colors"
      >
        Logout
      </button>
    </header>
  );
}

export default Navbar;
