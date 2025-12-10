import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  const isAdmin = user.roles?.some(role => 
    role.role?.name === 'admin' || role.name === 'admin'
  );

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <svg className="w-24 h-24 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <a href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
}

export default AdminRoute;
