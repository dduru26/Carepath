// src/routes/reminders.js
const express = require('express');
const router = express.Router();

// Simple in-memory store for demo purposes.
// This disappears when the server restarts, which is fine for the prototype.
const demoReminders = [];

/**
 * GET /api/reminders
 * Returns all reminders for a given userId from the in-memory store.
 * Example: /api/reminders?userId=1
 */
router.get('/', (req, res) => {
  try {
    const userId = Number(req.query.userId);

    if (!userId || Number.isNaN(userId)) {
      // no valid userId → just return empty list, don’t error
      return res.json([]);
    }

    const list = demoReminders
      .filter((r) => r.userId === userId)
      .sort(
        (a, b) =>
          new Date(a.scheduledFor).getTime() -
          new Date(b.scheduledFor).getTime()
      );

    return res.json(list);
  } catch (err) {
    console.error('Error in demo GET /api/reminders:', err);
    // degrade gracefully
    return res.json([]);
  }
});

/**
 * POST /api/reminders
 * Stores a new reminder in the in-memory array and returns it.
 * Body: { userId, clinicId, type, channel, scheduledFor }
 */
router.post('/', (req, res) => {
  try {
    const {
      userId,
      clinicId,
      type = 'visit',
      channel = 'SMS',
      scheduledFor,
    } = req.body;

    const numericUserId = Number(userId);

    if (!numericUserId || !scheduledFor) {
      return res
        .status(400)
        .json({ error: 'userId and scheduledFor are required' });
    }

    const reminder = {
      id: Date.now(), // cheap unique id for the demo
      userId: numericUserId,
      clinicId: clinicId ? Number(clinicId) : null,
      type,
      channel,
      scheduledFor,
      status: 'pending',
    };

    demoReminders.push(reminder);
    console.log('DEMO REMINDER STORED IN MEMORY:', reminder);

    return res.status(201).json(reminder);
  } catch (err) {
    console.error('Error in demo POST /api/reminders:', err);
    return res
      .status(400)
      .json({ error: 'Unable to create reminder (demo).' });
  }
});

module.exports = router;
