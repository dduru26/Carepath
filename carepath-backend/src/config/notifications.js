// src/config/notifications.js
const mode = process.env.NOTIFICATION_MODE || 'mock';

const SMS_DEFAULT_COUNTRY_CODE =
  process.env.SMS_DEFAULT_COUNTRY_CODE || '+234';

module.exports = {
  mode,
  SMS_DEFAULT_COUNTRY_CODE,
};
