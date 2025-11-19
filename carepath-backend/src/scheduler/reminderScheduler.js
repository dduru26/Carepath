// src/scheduler/reminderScheduler.js
const {
  getDueReminders,
  markReminderSent
} = require('../models/reminderStore');

const { getUserById } = require('../models/userStore');
const { sendNotification } = require('../services/notificationService');

let intervalId = null;

function startReminderScheduler() {
  if (intervalId) return; // avoid multiple

  console.log('[Scheduler] Starting reminder scheduler...');

  // Check every 30 seconds
  intervalId = setInterval(async () => {
    const now = new Date();
    const dueReminders = getDueReminders(now);

    if (dueReminders.length > 0) {
      console.log(`[Scheduler] Found ${dueReminders.length} due reminder(s) at ${now.toISOString()}`);
    }

    for (const reminder of dueReminders) {
      const user = getUserById(reminder.userId);
      if (!user) {
        console.warn(`[Scheduler] No user for reminder ${reminder.id}`);
        continue;
      }

      try {
        await sendNotification({
          phoneNumber: user.phoneNumber,
          channel: user.channel,
          message: reminder.message
        });

        markReminderSent(reminder.id);
        console.log(`[Scheduler] Reminder ${reminder.id} sent to ${user.phoneNumber}`);
      } catch (err) {
        console.error(`[Scheduler] Failed to send reminder ${reminder.id}`, err);
      }
    }
  }, 30 * 1000);
}

module.exports = {
  startReminderScheduler
};
