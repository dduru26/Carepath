// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { setAuthToken } from '../api/client';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { id, email, phoneNumber, role }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore from localStorage on first load
  useEffect(() => {
    const savedToken = localStorage.getItem('carepath_token');
    const savedUser = localStorage.getItem('carepath_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setAuthToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ email, phoneNumber, password }) => {
    const payload = { password };
    if (email) payload.email = email;
    if (phoneNumber) payload.phoneNumber = phoneNumber;

    const res = await axios.post('http://localhost:4000/auth/login', payload);
    const { token: newToken, user: userData } = res.data;

    setToken(newToken);
    setUser(userData);

    localStorage.setItem('carepath_token', newToken);
    localStorage.setItem('carepath_user', JSON.stringify(userData));

    setAuthToken(newToken);

    return userData;
  };

  const signup = async ({ email, phoneNumber, password, role, channel }) => {
    const res = await axios.post('http://localhost:4000/auth/signup', {
      email,
      phoneNumber,
      password,
      role: role || 'patient',
      channel: channel || 'sms',
    });

    const { token: newToken, user: userData } = res.data;

    setToken(newToken);
    setUser(userData);
    localStorage.setItem('carepath_token', newToken);
    localStorage.setItem('carepath_user', JSON.stringify(userData));
    setAuthToken(newToken);

    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('carepath_token');
    localStorage.removeItem('carepath_user');
    setAuthToken(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAdmin: user?.role === 'admin',
    isChw: user?.role === 'chw',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
