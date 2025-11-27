// src/components/Header.jsx
import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header
      style={{
        background: '#111827',
        color: 'white',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ fontWeight: 600, fontSize: '1rem' }}>
          CarePath
          <span style={{ fontWeight: 400, fontSize: '0.8rem', marginLeft: 6 }}>
            Kigali prototype
          </span>
        </div>

        <nav
          style={{
            display: 'flex',
            gap: '0.75rem',
            fontSize: '0.85rem',
          }}
        >
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? '#bfdbfe' : '#e5e7eb',
              textDecoration: 'none',
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/clinic-finder"
            style={({ isActive }) => ({
              color: isActive ? '#bfdbfe' : '#e5e7eb',
              textDecoration: 'none',
            })}
          >
            Find a clinic
          </NavLink>
          <NavLink
            to="/visit-guides"
            style={({ isActive }) => ({
              color: isActive ? '#bfdbfe' : '#e5e7eb',
              textDecoration: 'none',
            })}
          >
            Visit checklists
          </NavLink>
          <NavLink
            to="/reminders"
            style={({ isActive }) => ({
              color: isActive ? '#bfdbfe' : '#e5e7eb',
              textDecoration: 'none',
            })}
          >
            Reminders
          </NavLink>
          <NavLink
            to="/admin"
            style={({ isActive }) => ({
              color: isActive ? '#facc15' : '#e5e7eb',
              textDecoration: 'none',
            })}
          >
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
