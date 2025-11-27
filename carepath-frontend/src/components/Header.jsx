// src/components/Header.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, isAdmin, isChw, logout } = useAuth();

  return (
    <header
      style={{
        padding: '0.75rem 1.5rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <Link
          to="/"
          style={{
            fontWeight: 700,
            fontSize: '1.1rem',
            textDecoration: 'none',
            color: '#111827',
          }}
        >
          CarePath
        </Link>
        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
          for underserved communities
        </span>
      </div>

      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.9rem',
        }}
      >
        <NavLink
          to="/clinic-finder"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#2563eb' : '#4b5563',
          })}
        >
          Find a clinic
        </NavLink>

        <NavLink
          to="/visit-guides"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#2563eb' : '#4b5563',
          })}
        >
          Visit checklists
        </NavLink>

        <NavLink
          to="/reminders"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#2563eb' : '#4b5563',
          })}
        >
          Reminders
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/admin"
            style={({ isActive }) => ({
              textDecoration: 'none',
              color: isActive ? '#1d4ed8' : '#111827',
              fontWeight: 600,
            })}
          >
            Admin
          </NavLink>
        )}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {user ? (
          <>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{ fontSize: '0.85rem', color: '#111827', fontWeight: 500 }}
              >
                {user.email || user.phoneNumber}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {user.role === 'admin'
                  ? 'Admin'
                  : user.role === 'chw'
                  ? 'Community health worker'
                  : 'Patient'}
              </div>
            </div>
            <button
              onClick={logout}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '999px',
                padding: '0.35rem 0.9rem',
                background: '#f9fafb',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={{
              borderRadius: '999px',
              padding: '0.4rem 1rem',
              background: '#2563eb',
              color: 'white',
              textDecoration: 'none',
              fontSize: '0.85rem',
            }}
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
