const app = require('./app');
const { startReminderScheduler } = require('./scheduler/reminderScheduler');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`CarePath backend running on http://localhost:${PORT}`);
  startReminderScheduler();
});
