// src/app.js
const express = require('express');
const cors = require('cors');

const clinicsRoutes = require('./routes/clinics');
const visitGuidesRoutes = require('./routes/visitGuides');
const usersRoutes = require('./routes/users');
const remindersRoutes = require('./routes/reminders');
const clinicNotesRoutes = require('./routes/clinicNotes');
const authRoutes = require('./routes/auth');   // ⬅ add this

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use('/auth', authRoutes);                  // ⬅ mount auth first or anywhere
app.use('/api/clinics', clinicsRoutes);
app.use('/api/visit-guides', visitGuidesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/clinics', clinicNotesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CarePath API is running' });
});

module.exports = app;
