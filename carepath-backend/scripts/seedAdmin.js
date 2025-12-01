// scripts/seedAdmin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../src/prismaClient');

async function seedUsers() {
  try {
    console.log('Seeding initial users...');

    // Passwords – you can change these, but keep them simple for demo
    const adminPassword = 'Admin123!';
    const chwPassword = 'Chw123!';
    const userPassword = 'User123!';

    const adminHash = await bcrypt.hash(adminPassword, 10);
    const chwHash = await bcrypt.hash(chwPassword, 10);
    const userHash = await bcrypt.hash(userPassword, 10);

    // 1) Admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@carepath.rw' },
      update: {
        passwordHash: adminHash,
        role: 'admin',
      },
      create: {
        email: 'admin@carepath.rw',
        phoneNumber: '+250700000001',
        passwordHash: adminHash,
        role: 'admin',
        channel: 'SMS',
        language: 'English',
      },
    });

    console.log('Admin user:', {
      email: admin.email,
      role: admin.role,
    });

    // 2) CHW user
    const chw = await prisma.user.upsert({
      where: { email: 'chw@carepath.rw' },
      update: {
        passwordHash: chwHash,
        role: 'chw',
      },
      create: {
        email: 'chw@carepath.rw',
        phoneNumber: '+250700000002',
        passwordHash: chwHash,
        role: 'chw',
        channel: 'SMS',
        language: 'English',
      },
    });

    console.log('CHW user:', {
      email: chw.email,
      role: chw.role,
    });

    // 3) Normal patient/caregiver user
    const normalUser = await prisma.user.upsert({
      where: { email: 'user@carepath.rw' },
      update: {
        passwordHash: userHash,
        role: 'user',
      },
      create: {
        email: 'user@carepath.rw',
        phoneNumber: '+250700000003',
        passwordHash: userHash,
        role: 'user',
        channel: 'SMS',
        language: 'English',
      },
    });

    console.log('Normal user:', {
      email: normalUser.email,
      role: normalUser.role,
    });

    console.log('\n✅ Seeding complete.');
    console.log('Login credentials:');
    console.log('  Admin:  admin@carepath.rw /', adminPassword);
    console.log('  CHW:    chw@carepath.rw   /', chwPassword);
    console.log('  User:   user@carepath.rw  /', userPassword);
  } catch (err) {
    console.error('Error seeding users:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();
 