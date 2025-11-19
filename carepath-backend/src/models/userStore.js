// src/models/userStore.js

let users = [];
let nextUserId = 1;

function createOrUpdateUser({ phoneNumber, channel, language }) {
  let existing = users.find(u => u.phoneNumber === phoneNumber);

  if (existing) {
    existing.channel = channel || existing.channel;
    existing.language = language || existing.language;
    return existing;
  }

  const newUser = {
    id: nextUserId++,
    phoneNumber,
    channel: channel || 'sms',
    language: language || 'en',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  return newUser;
}

function getUserById(id) {
  return users.find(u => u.id === Number(id));
}

function getUserByPhone(phoneNumber) {
  return users.find(u => u.phoneNumber === phoneNumber);
}

function getAllUsers() {
  return users;
}

module.exports = {
  createOrUpdateUser,
  getUserById,
  getUserByPhone,
  getAllUsers
};
