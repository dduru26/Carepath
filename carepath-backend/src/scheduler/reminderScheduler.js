// src/scheduler/reminderScheduler.js
const prisma = require('../prismaClient');
const { sendReminderNotification } = require('../services/notificationService');

/**
 * Schedules a single reminder in memory using setTimeout.
 * This is OK for dev. Later you can replace with a job queue or cron.
 */
function scheduleReminderInProcess(reminder) {
  const now = Date.now();
  const runAt = new Date(reminder.scheduledFor).getTime();
  const delay = runAt - now;

  if (delay <= 0) {
    console.log(
      'Reminder scheduledFor is in the past, sending immediately:',
      reminder.id
    );
    fireReminder(reminder);
    return;
  }

  console.log(
    `Scheduling reminder ${reminder.id} for user ${reminder.userId} in ${Math.round(
      delay / 1000
    )} seconds`
  );

  setTimeout(() => {
    fireReminder(reminder);
  }, delay);
}

/**
 * Actually send the reminder and update DB status.
 */
async function fireReminder(reminder) {
  try {
    // Reload the latest reminder record in case it was cancelled
    const fresh = await prisma.reminder.findUnique({
      where: { id: reminder.id },
      include: {
        user: true,
        clinic: true, // if you have a relation; otherwise remove
      },
    });

    if (!fresh) {
      console.warn('Reminder no longer exists, skipping:', reminder.id);
      return;
    }

    if (fresh.status === 'cancelled') {
      console.log('Reminder cancelled, skipping:', fresh.id);
      return;
    }

    const result = await sendReminderNotification({
      reminder: fresh,
      clinic: fresh.clinic || null,
      user: fresh.user,
    });

    if (result.ok) {
      await prisma.reminder.update({
        where: { id: fresh.id },
        data: {
          status: 'sent',
          sentAt: new Date(),
        },
      });
      console.log('Reminder sent successfully:', fresh.id);
    } else {
      await prisma.reminder.update({
        where: { id: fresh.id },
        data: {
          status: 'failed',
          errorMessage: result.reason || 'Unknown failure',
        },
      });
      console.warn('Reminder failed to send:', fresh.id, result.reason);
    }
  } catch (err) {
    console.error('Error while sending reminder:', err);
    try {
      await prisma.reminder.update({
        where: { id: reminder.id },
        data: {
          status: 'failed',
          errorMessage: err.message || 'Unexpected error',
        },
      });
    } catch (inner) {
      console.error('Also failed to update reminder status:', inner);
    }
  }
}

/**
 * Called when a reminder is created.
 * Use this in your reminders route.
 */
async function onNewReminderCreated(reminderId) {
  const reminder = await prisma.reminder.findUnique({
    where: { id: reminderId },
  });
  if (!reminder) {
    console.warn('onNewReminderCreated: reminder not found', reminderId);
    return;
  }

  scheduleReminderInProcess(reminder);
}

/**
 * Optionally: when server starts, reschedule pending reminders.
 * You might already have something like this.
 */
async function reschedulePendingReminders() {
  const pending = await prisma.reminder.findMany({
    where: {
      status: 'pending',
    },
  });

  console.log(`Rescheduling ${pending.length} pending reminders on startup`);
  pending.forEach(scheduleReminderInProcess);
}

module.exports = {
  onNewReminderCreated,
  reschedulePendingReminders,
};
