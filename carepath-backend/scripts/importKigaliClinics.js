// scripts/importKigaliClinics.js
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, '..', 'data', 'kigali_clinics.json');

  console.log('Reading file:', filePath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`JSON file not found at ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  let clinicsFromFile;
  try {
    clinicsFromFile = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse JSON:', err.message);
    throw err;
  }

  if (!Array.isArray(clinicsFromFile)) {
    throw new Error('kigali_clinics.json must be an array of objects');
  }

  console.log(`Loaded ${clinicsFromFile.length} clinics from JSON file.`);

  let createdCount = 0;
  for (const item of clinicsFromFile) {
    const name = item.name?.trim();
    if (!name) {
      console.warn('Skipping clinic without name:', item);
      continue;
    }

    if (
      typeof item.latitude !== 'number' ||
      typeof item.longitude !== 'number'
    ) {
      console.warn('Skipping clinic without numeric coords:', name);
      continue;
    }

    const area = item.area || null;

    // crude mapping from type → services
    let inferredService = 'general';
    const t = (item.type || '').toLowerCase();
    if (t.includes('hospital')) inferredService = 'hospital';
    else if (t.includes('health centre') || t.includes('health center'))
      inferredService = 'primary-care';
    else if (t.includes('clinic')) inferredService = 'clinic';

    try {
      const created = await prisma.clinic.create({
        data: {
          name,
          area,
          address: null,
          latitude: item.latitude,
          longitude: item.longitude,
          openingHours: null,
          services: inferredService,
          isPublic: true,
        },
      });

      createdCount += 1;
      console.log('✅ Created clinic:', created.id, '-', created.name);
    } catch (err) {
      console.error('❌ Failed to create clinic:', name, '-', err.message);
    }
  }

  console.log(`Finished. Successfully created ${createdCount} clinics.`);
}

main()
  .catch((e) => {
    console.error('Importer crashed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
