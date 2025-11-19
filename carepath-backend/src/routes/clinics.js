// src/routes/clinics.js
const express = require('express');
const router = express.Router();
const clinics = require('../data/clinics.json');

// Helper: Haversine distance in km between two points
function distanceInKm(lat1, lon1, lat2, lon2) {
  const toRad = value => (value * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET /api/clinics
// Supports:
// - ?area=Village A
// - ?service=antenatal
// - ?lat=6.5&lng=3.2&radiusKm=10
router.get('/', (req, res) => {
  const { area, service, lat, lng, radiusKm } = req.query;

  let result = clinics;

  // Manual area/town filtering
  if (area) {
    const areaLower = area.toLowerCase();
    result = result.filter(c =>
      (c.area && c.area.toLowerCase().includes(areaLower)) ||
      (c.address && c.address.toLowerCase().includes(areaLower))
    );
  }

  // Service filtering
  if (service) {
    const sLower = service.toLowerCase();
    result = result.filter(c =>
      (c.services || []).some(s => s.toLowerCase() === sLower)
    );
  }

  // Optional GPS / radius filtering
  if (lat && lng && radiusKm) {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const radiusNum = parseFloat(radiusKm);

    result = result.filter(c => {
      if (typeof c.latitude !== 'number' || typeof c.longitude !== 'number') {
        return false;
      }
      const d = distanceInKm(latNum, lngNum, c.latitude, c.longitude);
      return d <= radiusNum;
    });
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
