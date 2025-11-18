// src/app.js
const express = require('express');
const cors = require('cors');

const clinicsRoutes = require('./routes/clinics');
const visitGuidesRoutes = require('./routes/visitGuides');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/clinics', clinicsRoutes);
app.use('/api/visit-guides', visitGuidesRoutes);

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CarePath API is running' });
});

module.exports = app;
