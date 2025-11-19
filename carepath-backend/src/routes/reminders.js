const express = require('express');
const router = express.Router();

const {
  createReminder,
  getRemindersForUser,
  getAllReminders
} = require('../models/reminderStore');

const { getUserById } = require('../models/userStore');

router.post('/', (req, res) => {
  const { userId, type, scheduledAt, message, metadata } = req.body;

  if (!userId || !type || !scheduledAt || !message) {
    return res.status(400).json({
      error: 'userId, type, scheduledAt, and message are required'
    });
  }

  const user = getUserById(userId);
  if (!user) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  const reminder = createReminder({
    userId,
    type,
    scheduledAt,
    message,
    metadata
  });

  res.status(201).json(reminder);
});

router.get('/', (req, res) => {
  const { userId } = req.query;

  if (userId) {
    const list = getRemindersForUser(userId);
    return res.json(list);
  }

  res.json(getAllReminders());
});

module.exports = router;
