const app = require('./app');
const { startReminderScheduler } = require('./scheduler/reminderScheduler');

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`CarePath backend running on http://localhost:${PORT}`);
  try {
    await reschedulePendingReminders();
  } catch (err) {
    console.error('Error rescheduling reminders on startup:', err);
  }
});