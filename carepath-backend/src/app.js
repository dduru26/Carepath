const express = require('express');
const cors = require('cors');

const clinicsRoutes = require('./routes/clinics');
const visitGuidesRoutes = require('./routes/visitGuides');
const usersRoutes = require('./routes/users');
const remindersRoutes = require('./routes/reminders');

console.log('clinicsRoutes is:', typeof clinicsRoutes);
console.log('visitGuidesRoutes is:', typeof visitGuidesRoutes);
console.log('usersRoutes is:', typeof usersRoutes);
console.log('remindersRoutes is:', typeof remindersRoutes);


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/clinics', clinicsRoutes);
app.use('/api/visit-guides', visitGuidesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reminders', remindersRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CarePath API is running' });
});

module.exports = app;
