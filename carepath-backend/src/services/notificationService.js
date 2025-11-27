// src/services/notificationService.js
const { mode, SMS_DEFAULT_COUNTRY_CODE } = require('../config/notifications');

/**
 * Normalizes a phone number.
 * For now we do something simple: if it doesn't start with "+", we prefix
 * the default country code. You can make this smarter later.
 */
function normalizePhoneNumber(raw) {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('+')) return trimmed;
  return `${SMS_DEFAULT_COUNTRY_CODE}${trimmed.replace(/^0+/, '')}`;
}

/**
 * Build a human-friendly reminder message.
 * You can customize this copy later.
 */
function buildReminderMessage({ type, clinic, user, reminder }) {
  const namePart = user?.email || user?.phoneNumber || 'CarePath user';

  if (type === 'appointment') {
    return `Hi ${namePart}, this is your CarePath reminder for your clinic visit at ${
      clinic?.name || 'your selected clinic'
    } on ${new Date(reminder.scheduledFor).toLocaleString()}.`;
  }

  if (type === 'medication') {
    return `Hi ${namePart}, this is your CarePath medication reminder. Don't forget to take your medicine as prescribed.`;
  }

  // Fallback generic
  return `Hi ${namePart}, this is your CarePath reminder.`;
}

/**
 * "Mock" sender: logs to console instead of hitting a real provider.
 * Great for development.
 */
async function sendMock({ to, channel, message }) {
  console.log('--- MOCK NOTIFICATION ---');
  console.log('Channel:', channel);
  console.log('To:', to);
  console.log('Message:', message);
  console.log('-------------------------');
  // simulate async
  return { ok: true, provider: 'mock' };
}

/**
 * Placeholder real SMS sender (e.g. Twilio / Termii).
 * Right now this just throws if you try to use it.
 * When you're ready to integrate a provider, you'll implement this.
 */
async function sendViaRealProvider({ to, channel, message }) {
  // TODO: integrate with Twilio/Termii/etc
  // For now, just throw with a clear message so you know if you accidentally
  // switched NOTIFICATION_MODE away from "mock".
  throw new Error(
    `Real provider sending not implemented yet (mode=${mode}). Tried to send ${channel} to ${to}.`
  );
}

/**
 * Main entry point: send a reminder to a user about a clinic.
 *
 * @param {Object} params
 * @param {Object} params.reminder - the reminder record (Prisma)
 * @param {Object|null} params.clinic - optional clinic record
 * @param {Object} params.user - the user record
 */
async function sendReminderNotification({ reminder, clinic, user }) {
  const channel = reminder.channel || user.channel || 'sms';

  const toRaw = user.phoneNumber;
  const to = normalizePhoneNumber(toRaw);

  if (!to) {
    console.warn('No valid phone number for user, skipping reminder', {
      userId: user.id,
      reminderId: reminder.id,
    });
    return {
      ok: false,
      reason: 'no_phone',
    };
  }

  const message = buildReminderMessage({
    type: reminder.type,
    clinic,
    user,
    reminder,
  });

  if (mode === 'mock') {
    return sendMock({ to, channel, message });
  }

  // Later: if you support different providers, you could branch on mode:
  // if (mode === 'twilio') return sendTwilio({ to, channel, message });
  // if (mode === 'termii') return sendTermii({ to, channel, message });
  return sendViaRealProvider({ to, channel, message });
}

module.exports = {
  sendReminderNotification,
};
