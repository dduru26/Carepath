// src/routes/clinics.js
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: convert DB clinic into API shape (services as array)
function toApiClinic(c) {
  if (!c) return c;
  return {
    ...c,
    services: c.services
      ? c.services.split(',').map(s => s.trim()).filter(Boolean)
      : []
  };
}

/**
 * GET /api/clinics
 * Fetch all clinics
 */
router.get('/', async (req, res) => {
  try {
    const clinics = await prisma.clinic.findMany({
      orderBy: { name: 'asc' }
    });

    const formatted = clinics.map(toApiClinic);
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching clinics:', err);
    res.status(500).json({ error: 'Unable to fetch clinics' });
  }
});

/**
 * GET /api/clinics/:id
 * Fetch a single clinic
 */
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const clinic = await prisma.clinic.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!clinic) {
      return res.status(404).json({ error: 'Clinic not found' });
    }

    const formatted = toApiClinic(clinic);
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching clinic:', err);
    res.status(500).json({ error: 'Unable to fetch clinic' });
  }
});

/**
 * POST /api/clinics
 * Create a new clinic (admin-only in future)
 */
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    const newClinic = await prisma.clinic.create({
      data: {
        name: data.name,
        address: data.address || null,
        area: data.area || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        openingHours: data.openingHours || null,
        // store as string in DB
        services: Array.isArray(data.services)
          ? data.services.join(',')
          : '',
        isPublic: data.isPublic ?? true
      }
    });

    res.status(201).json(toApiClinic(newClinic));
  } catch (err) {
    console.error('Error creating clinic:', err);
    res.status(500).json({ error: 'Unable to create clinic' });
  }
});

/**
 * PUT /api/clinics/:id
 * Update clinic information
 */
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const updatedClinic = await prisma.clinic.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        area: data.area,
        latitude: data.latitude,
        longitude: data.longitude,
        openingHours: data.openingHours,
        services: Array.isArray(data.services)
          ? data.services.join(',')
          : '',
        isPublic: data.isPublic
      }
    });

    res.json(toApiClinic(updatedClinic));
  } catch (err) {
    console.error('Error updating clinic:', err);
    res.status(500).json({ error: 'Unable to update clinic' });
  }
});

/**
 * DELETE /api/clinics/:id
 * Delete clinic
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.clinic.delete({
      where: { id }
    });

    res.json({ message: 'Clinic deleted' });
  } catch (err) {
    console.error('Error deleting clinic:', err);
    res.status(500).json({ error: 'Unable to delete clinic' });
  }
});

module.exports = router;
