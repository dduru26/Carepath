const express = require('express');
const router = express.Router();

const { getClinicById } = require('../models/clinicStore');
const { addNote, getNotesForClinic } = require('../models/clinicNotesStore');

// GET /api/clinics/:clinicId/notes
router.get('/:clinicId/notes', (req, res) => {
  const { clinicId } = req.params;
  const clinic = getClinicById(clinicId);
  if (!clinic) {
    return res.status(404).json({ error: 'Clinic not found' });
  }

  const notes = getNotesForClinic(clinicId);
  res.json(notes);
});

// POST /api/clinics/:clinicId/notes
// body: { authorName, role, content }
router.post('/:clinicId/notes', (req, res) => {
  const { clinicId } = req.params;
  const { authorName, role, content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'content is required' });
  }

  const clinic = getClinicById(clinicId);
  if (!clinic) {
    return res.status(404).json({ error: 'Clinic not found' });
  }

  const note = addNote({ clinicId, authorName, role, content });
  res.status(201).json(note);
});

module.exports = router;
