// src/api/client.js
import axios from 'axios';

const api = axios.create({
  // Point directly at your backend
  baseURL: 'http://localhost:4000/api',
  // optional: timeout: 10000,
});

export default api;
