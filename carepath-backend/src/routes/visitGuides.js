// src/routes/visitGuides.js
const express = require('express');
const router = express.Router();
const visitGuides = require('../data/visitGuides.json');

// GET /api/visit-guides
// GET /api/visit-guides?type=antenatal
router.get('/', (req, res) => {
  const { type } = req.query;

  let result = visitGuides;

  if (type) {
    const typeLower = type.toLowerCase();
    result = result.filter(g => g.type.toLowerCase() === typeLower);
  }

  res.json(result);
});

// GET /api/visit-guides/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const guide = visitGuides.find(g => g.id === id);

  if (!guide) {
    return res.status(404).json({ error: 'Visit guide not found' });
  }

  res.json(guide);
});

module.exports = router;
