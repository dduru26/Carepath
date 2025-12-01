// src/components/RequireAuth.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth({ children }) {
  const { user, initialising } = useAuth();
  const location = useLocation();

  if (initialising) {
    return <p style={{ padding: '1rem' }}>Loading session…</p>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}
