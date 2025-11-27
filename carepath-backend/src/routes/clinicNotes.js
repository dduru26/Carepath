// src/routes/clinicNotes.js
const express = require('express');
const router = express.Router({ mergeParams: true });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { requireAuth } = require('../middleware/auth');

/**
 * Helper middleware: allow CHW or admin
 */
function requireChwOrAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  if (req.user.role !== 'chw' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
}

/**
 * GET /api/clinics/:clinicId/notes
 * Fetch notes for a clinic (public)
 */
router.get('/:clinicId/notes', async (req, res) => {
  try {
    const clinicId = Number(req.params.clinicId);

    if (Number.isNaN(clinicId)) {
      return res.status(400).json({ error: 'Invalid clinicId' });
    }

    const notes = await prisma.clinicNote.findMany({
      where: { clinicId },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = notes.map((n) => ({
      id: n.id,
      clinicId: n.clinicId,
      author: n.authorName || 'Community health worker',
      role: n.role || 'chw',
      content: n.content,
      createdAt: n.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching clinic notes:', err);
    res
      .status(500)
      .json({ error: 'Unable to fetch notes for this clinic' });
  }
});

/**
 * POST /api/clinics/:clinicId/notes
 * Add a note for a clinic (CHW/admin only)
 */
router.post(
  '/:clinicId/notes',
  requireAuth,
  requireChwOrAdmin,
  async (req, res) => {
    try {
      const clinicId = Number(req.params.clinicId);
      const { authorName, role, content } = req.body;

      if (Number.isNaN(clinicId)) {
        return res.status(400).json({ error: 'Invalid clinicId' });
      }

      if (!content || !content.trim()) {
        return res
          .status(400)
          .json({ error: 'Note content is required' });
      }

      const note = await prisma.clinicNote.create({
        data: {
          clinicId,
          authorName: authorName || null,
          role: role || 'chw',
          content: content.trim(),
          authorId: req.user.id ?? null,
        },
      });

      const formatted = {
        id: note.id,
        clinicId: note.clinicId,
        author: note.authorName || 'Community health worker',
        role: note.role,
        content: note.content,
        createdAt: note.createdAt,
      };

      res.status(201).json(formatted);
    } catch (err) {
      console.error('Error creating clinic note:', err);
      res.status(500).json({ error: 'Unable to save note' });
    }
  }
);

module.exports = router;
