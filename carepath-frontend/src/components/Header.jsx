// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        padding: '0.75rem 1.25rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link
          to="/clinic-finder"
          style={{
            fontWeight: 700,
            fontSize: '1.1rem',
            textDecoration: 'none',
            color: '#111827',
          }}
        >
          CarePath
        </Link>

        {user && (
          <nav
            style={{
              display: 'flex',
              gap: '0.75rem',
              fontSize: '0.9rem',
            }}
          >
            <Link to="/clinic-finder">Find a clinic</Link>
            <Link to="/visit-guides">Visit checklists</Link>
            <Link to="/reminders">Reminders</Link>
            {isAdmin && <Link to="/admin">Admin</Link>}
          </nav>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.85rem',
        }}
      >
        {user ? (
          <>
            <span style={{ color: '#4b5563' }}>
              {user.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: 999,
                padding: '0.25rem 0.75rem',
                background: 'white',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link
              to="/signup"
              style={{
                borderRadius: 999,
                padding: '0.25rem 0.75rem',
                background: '#2563eb',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
