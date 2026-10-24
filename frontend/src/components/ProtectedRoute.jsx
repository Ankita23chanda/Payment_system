import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Loading your session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve the current location so login can redirect back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
