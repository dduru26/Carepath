// src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-fallback-secret';

// Helper to generate a JWT
function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * POST /auth/signup
 * Create a new user account (for now: email + phone + password)
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, phoneNumber, password, role, channel } = req.body;

    if (!phoneNumber || !password) {
      return res
        .status(400)
        .json({ error: 'phoneNumber and password are required' });
    }

    // Check if user already exists
    const existingByPhone = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (existingByPhone) {
      return res
        .status(409)
        .json({ error: 'A user with this phone number already exists' });
    }

    if (email) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingByEmail) {
        return res
          .status(409)
          .json({ error: 'A user with this email already exists' });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email || null,
        phoneNumber,
        passwordHash,
        role: role || 'patient', // later we can restrict roles
        channel: channel || 'sms',
      },
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Error in /auth/signup:', err);
    res.status(500).json({ error: 'Unable to create account' });
  }
});

/**
 * POST /auth/login
 * Log in by email or phone + password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    if (!password || (!email && !phoneNumber)) {
      return res
        .status(400)
        .json({ error: 'Provide password and either email or phoneNumber' });
    }

    let user = null;
    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    } else if (phoneNumber) {
      user = await prisma.user.findUnique({ where: { phoneNumber } });
    }

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Error in /auth/login:', err);
    res.status(500).json({ error: 'Unable to log in' });
  }
});

module.exports = router;
