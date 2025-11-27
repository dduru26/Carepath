// src/routes/clinics.js
const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// simple haversine distance in km
function distanceKm(lat1, lon1, lat2, lon2) {
  function toRad(v) {
    return (v * Math.PI) / 180;
  }

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
// supports:
//  - ?area=Kigali
//  - ?service=hospital|clinic|primary-care|general
//  - ?lat=...&lng=...&radiusKm=10
router.get('/', async (req, res) => {
  try {
    const { area, service, lat, lng, radiusKm } = req.query;

    // 1. Start from all public clinics
    let clinics = await prisma.clinic.findMany({
      where: {
        isPublic: true,
      },
      orderBy: { name: 'asc' },
    });

    // 2. Filter by area (case-insensitive match on area or name)
    if (area && area.trim()) {
      const term = area.trim().toLowerCase();
      clinics = clinics.filter((c) => {
        const areaStr = (c.area || '').toLowerCase();
        const nameStr = (c.name || '').toLowerCase();
        return areaStr.includes(term) || nameStr.includes(term);
      });
    }

    // 3. Filter by service tag (we stored a single string in `services`)
    if (service && service.trim()) {
      const s = service.trim().toLowerCase();
      clinics = clinics.filter((c) => {
        const tag = (c.services || '').toLowerCase();
        // either exact or contains
        return tag === s || tag.includes(s);
      });
    }

    // 4. Optional: filter by distance if lat/lng provided
    let useDistance = false;
    let centerLat = parseFloat(lat);
    let centerLng = parseFloat(lng);
    let radius = parseFloat(radiusKm) || 10; // default 10km

    if (
      !Number.isNaN(centerLat) &&
      !Number.isNaN(centerLng)
    ) {
      useDistance = true;
    }

    if (useDistance) {
      clinics = clinics
        .map((c) => {
          if (
            typeof c.latitude === 'number' &&
            typeof c.longitude === 'number'
          ) {
            const dist = distanceKm(
              centerLat,
              centerLng,
              c.latitude,
              c.longitude
            );
            return { ...c, distanceKm: dist };
          }
          return { ...c, distanceKm: null };
        })
        .filter(
          (c) =>
            c.distanceKm !== null && c.distanceKm <= radius
        )
        .sort((a, b) => a.distanceKm - b.distanceKm);
    }

    res.json(clinics);
  } catch (err) {
    console.error('Error fetching clinics:', err);
    res.status(500).json({ error: 'Unable to load clinics' });
  }
});

// GET /api/clinics/:id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid clinic id' });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { id },
    });

    if (!clinic) {
      return res.status(404).json({ error: 'Clinic not found' });
    }

    res.json(clinic);
  } catch (err) {
    console.error('Error fetching clinic by id:', err);
    res.status(500).json({ error: 'Unable to load clinic' });
  }
});

module.exports = router;
