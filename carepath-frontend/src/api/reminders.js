import api from './client';

// Create or update user profile
export async function saveUserProfile({ phoneNumber, channel, language }) {
  const res = await api.post('/users', { phoneNumber, channel, language });
  return res.data;
}

// Create a reminder
export async function createReminder({ userId, type, scheduledAt, message, metadata }) {
  const res = await api.post('/reminders', {
    userId,
    type,
    scheduledAt,
    message,
    metadata
  });
  return res.data;
}

// Get reminders for a user
export async function getReminders(userId) {
  const res = await api.get('/reminders', { params: { userId } });
  return res.data;
}
