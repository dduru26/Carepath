const express = require('express');
const router = express.Router();
const {
  getAllClinics,
  getClinicById,
  createClinic,
  updateClinic,
  deleteClinic
} = require('../models/clinicStore');

// Haversine
function distanceInKm(lat1, lon1, lat2, lon2) {
  const toRad = value => (value * Math.PI) / 180;
  const R = 6371;

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

// GET /api/clinics (search)
router.get('/', (req, res) => {
  const { area, service, lat, lng, radiusKm } = req.query;

  let result = getAllClinics();

  if (area) {
    const areaLower = area.toLowerCase();
    result = result.filter(c =>
      (c.area && c.area.toLowerCase().includes(areaLower)) ||
      (c.address && c.address.toLowerCase().includes(areaLower))
    );
  }

  if (service) {
    const sLower = service.toLowerCase();
    result = result.filter(c =>
      (c.services || []).some(s => s.toLowerCase() === sLower)
    );
  }

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
  const clinic = getClinicById(req.params.id);
  if (!clinic) {
    return res.status(404).json({ error: 'Clinic not found' });
  }
  res.json(clinic);
});

// ADMIN: POST /api/clinics
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  const clinic = createClinic(req.body);
  res.status(201).json(clinic);
});

// ADMIN: PUT /api/clinics/:id
router.put('/:id', (req, res) => {
  const updated = updateClinic(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Clinic not found' });
  }
  res.json(updated);
});

// ADMIN: DELETE /api/clinics/:id
router.delete('/:id', (req, res) => {
  const ok = deleteClinic(req.params.id);
  if (!ok) {
    return res.status(404).json({ error: 'Clinic not found' });
  }
  res.status(204).end();
});

module.exports = router;
