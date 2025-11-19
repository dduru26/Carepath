const express = require('express');
const router = express.Router();

const {
  createOrUpdateUser,
  getAllUsers
} = require('../models/userStore');

router.post('/', (req, res) => {
  const { phoneNumber, channel, language } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'phoneNumber is required' });
  }

  const user = createOrUpdateUser({ phoneNumber, channel, language });
  res.json(user);
});

router.get('/', (req, res) => {
  res.json(getAllUsers());
});

module.exports = router;
