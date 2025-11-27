// src/api/client.js
import axios from 'axios';

// Point directly at your backend API prefix
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Helper to set / clear Authorization header
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;
