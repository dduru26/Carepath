// src/routes/reminders.js
const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');
const {
  onNewReminderCreated,
} = require('../scheduler/reminderScheduler'); // adjust path if needed

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Helper: extract userId from Authorization: Bearer <token>
function getUserIdFromReq(req) {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' '); // 'Bearer <token>'
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload.userId;
  } catch (err) {
    console.warn('Invalid token on reminders route:', err.message);
    return null;
  }
}

/**
 * GET /api/reminders
 * Return all reminders for the logged-in user
 */
router.get('/', async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const reminders = await prisma.reminder.findMany({
      where: { userId },
      orderBy: { scheduledFor: 'asc' },
      include: {
        clinic: true, // so frontend can show clinic.name, clinic.area
      },
    });

    res.json(reminders);
  } catch (err) {
    console.error('Error loading reminders:', err);
    res.status(500).json({ error: 'Unable to load reminders.' });
  }
});

/**
 * POST /api/reminders
 * Create a reminder for the logged-in user
 */
router.post('/', async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { clinicId, type, channel, scheduledFor } = req.body;

    if (!scheduledFor) {
      return res
        .status(400)
        .json({ error: 'scheduledFor (ISO date string) is required.' });
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId,
        clinicId: clinicId || null,
        type: type || 'visit',
        channel: channel || 'SMS',
        scheduledFor: new Date(scheduledFor),
        status: 'pending',
      },
      include: {
        clinic: true,
      },
    });

    // schedule it in memory so the dev scheduler can fire later
    if (onNewReminderCreated) {
      onNewReminderCreated(reminder.id);
    }

    res.status(201).json(reminder);
  } catch (err) {
    console.error('Error creating reminder:', err);
    res.status(500).json({ error: 'Unable to create reminder.' });
  }
});

module.exports = router;
