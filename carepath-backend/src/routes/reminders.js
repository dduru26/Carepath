// src/routes/reminders.js
const express = require('express');
const router = express.Router();

const prisma = require('../prismaClient');
const {
  onNewReminderCreated,
} = require('../scheduler/reminderScheduler'); // import scheduler handler

/**
 * GET /api/reminders
 * Returns all reminders for a given userId from the database.
 * Example: /api/reminders?userId=1
 */
router.get('/', async (req, res) => {
  try {
    const userId = Number(req.query.userId);

    if (!userId || Number.isNaN(userId)) {
      // no valid userId → just return empty list, don’t error
      return res.json([]);
    }

    const reminders = await prisma.reminder.findMany({
      where: { userId },
      orderBy: { scheduledFor: 'asc' },
      include: {
        clinic: true,   // <- pull clinic details
        },
    });

    return res.json(reminders);
  } catch (err) {
    console.error('Error in GET /api/reminders:', err);
    // degrade gracefully for the UI
    return res.json([]);
  }
});

/**
 * POST /api/reminders
 * Stores a new reminder in the database and returns it.
 * Body: { userId, clinicId, type, channel, scheduledFor }
 */
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      clinicId,
      type = 'visit',
      channel = 'SMS',
      scheduledFor,
    } = req.body;

    const numericUserId = Number(userId);
    const numericClinicId = clinicId ? Number(clinicId) : null;

    if (!numericUserId || !scheduledFor) {
      return res
        .status(400)
        .json({ error: 'userId and scheduledFor are required' });
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId: numericUserId,
        clinicId: numericClinicId,
        type,
        channel,
        scheduledFor: new Date(scheduledFor),
        status: 'pending',
      },
    });

    // Try to schedule it in-process; if scheduler fails, we still return 201
    onNewReminderCreated(reminder.id).catch((err) =>
      console.error('Failed to schedule reminder after create:', err)
    );

    return res.status(201).json(reminder);
  } catch (err) {
    console.error('Error in POST /api/reminders:', err);
    return res.status(500).json({ error: 'Unable to create reminder' });
  }
});

/**
 * (Optional) Cancel endpoint for future UI
 * PATCH /api/reminders/:id/cancel
 */
router.patch('/:id/cancel', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid reminder id' });
    }

    const updated = await prisma.reminder.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    return res.json(updated);
  } catch (err) {
    console.error('Error in PATCH /api/reminders/:id/cancel:', err);
    return res.status(500).json({ error: 'Unable to cancel reminder' });
  }
});

module.exports = router;
