// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // adjust for production
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('carepath_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
