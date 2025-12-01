// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialising, setInitialising] = useState(true);
  const [authError, setAuthError] = useState('');

  // Restore session on first load
  useEffect(() => {
    const token = localStorage.getItem('carepath_token');
    if (!token) {
      setInitialising(false);
      return;
    }

    const restoreSession = async () => {
      try {
        setAuthError('');
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        console.error('Error restoring session:', err);
        localStorage.removeItem('carepath_token');
        setUser(null);
      } finally {
        setInitialising(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    setAuthError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: loggedInUser } = res.data;

      if (token) {
        localStorage.setItem('carepath_token', token);
      }
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      console.error('Login failed:', err);
      const msg =
        err.response?.data?.error || 'Login failed. Please try again.';
      setAuthError(msg);
      throw err;
    }
  };

  const signup = async ({
    email,
    phoneNumber,
    password,
    channel,
    language,
  }) => {
    setAuthError('');
    try {
      const payload = {
        email,
        phoneNumber: phoneNumber || '',
        password,
        channel: channel || 'SMS',
        language: language || 'English',
      };

      const res = await api.post('/auth/register', payload);
      const { token, user: newUser } = res.data;

      if (token) {
        localStorage.setItem('carepath_token', token);
      }
      setUser(newUser);
      return newUser;
    } catch (err) {
      console.error('Signup failed:', err);
      const msg =
        err.response?.data?.error || 'Sign up failed. Please try again.';
      setAuthError(msg);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('carepath_token');
    setUser(null);
    setAuthError('');
  };

  const isAdmin = user?.role === 'admin';
  const isChw = user?.role === 'chw';

  const value = {
    user,
    isAdmin,
    isChw,
    login,
    signup,
    logout,
    initialising,
    authError,
    setAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
