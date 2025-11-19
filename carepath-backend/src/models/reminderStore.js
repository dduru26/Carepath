// src/models/reminderStore.js

let reminders = [];
let nextReminderId = 1;

function createReminder({ userId, type, scheduledAt, message, metadata }) {
  const reminder = {
    id: nextReminderId++,
    userId,
    type, // 'appointment' | 'medication' | etc.
    scheduledAt, // ISO string
    message,
    metadata: metadata || {},
    status: 'scheduled', // 'scheduled' | 'sent' | 'cancelled'
    createdAt: new Date().toISOString(),
    lastAttemptAt: null
  };

  reminders.push(reminder);
  return reminder;
}

function getRemindersForUser(userId) {
  return reminders.filter(r => r.userId === Number(userId));
}

function getAllReminders() {
  return reminders;
}

function markReminderSent(id) {
  const r = reminders.find(r => r.id === id);
  if (r) {
    r.status = 'sent';
    r.lastAttemptAt = new Date().toISOString();
  }
  return r;
}

function getDueReminders(now = new Date()) {
  const nowTime = now.getTime();
  return reminders.filter(r => {
    if (r.status !== 'scheduled') return false;
    const scheduledTime = new Date(r.scheduledAt).getTime();
    return scheduledTime <= nowTime;
  });
}

module.exports = {
  createReminder,
  getRemindersForUser,
  getAllReminders,
  markReminderSent,
  getDueReminders
};
