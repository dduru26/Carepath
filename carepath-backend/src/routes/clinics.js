// src/routes/clinics.js
const express = require('express');
const router = express.Router();
const clinics = require('../data/clinics.json');

// GET /api/clinics?area=Village%20A&service=antenatal
router.get('/', (req, res) => {
  const { area, service } = req.query;

  let result = clinics;

  if (area) {
    const areaLower = area.toLowerCase();
    result = result.filter(c =>
      c.area.toLowerCase().includes(areaLower) ||
      c.address.toLowerCase().includes(areaLower)
    );
  }

  if (service) {
    const sLower = service.toLowerCase();
    result = result.filter(c =>
      (c.services || []).some(s => s.toLowerCase() === sLower)
    );
  }

  res.json(result);
});

// GET /api/clinics/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const clinic = clinics.find(c => c.id === id);

  if (!clinic) {
    return res.status(404).json({ error: 'Clinic not found' });
  }

  res.json(clinic);
});

module.exports = router;
