// src/components/RequireAdmin.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p style={{ padding: '1rem' }}>Checking access…</p>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!isAdmin) {
    return (
      <main style={{ padding: '1.5rem' }}>
        <h1>Access denied</h1>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          You need an admin account to view this page.
        </p>
      </main>
    );
  }

  return children;
}
