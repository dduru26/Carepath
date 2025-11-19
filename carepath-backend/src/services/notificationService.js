// src/services/notificationService.js

async function sendNotification({ phoneNumber, channel, message }) {
  // In a real implementation, you'd call Twilio/Termii/etc here.
  console.log(
    `[Notification] channel=${channel} to=${phoneNumber} message="${message}"`
  );

  // Simulate async provider call
  return { success: true, providerId: 'mock-123' };
}

module.exports = {
  sendNotification
};
