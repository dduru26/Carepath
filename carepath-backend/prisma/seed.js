// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const clinicsData = require('../src/data/clinics.json');

async function seedClinics() {
  console.log('Clearing existing clinics & notes...');
  await prisma.clinicNote.deleteMany();
  await prisma.clinic.deleteMany();

  console.log('Seeding clinics...');
  for (const c of clinicsData) {
    await prisma.clinic.create({
      data: {
        name: c.name,
        address: c.address || null,
        area: c.area || null,
        latitude:
          typeof c.latitude === 'number' ? c.latitude : null,
        longitude:
          typeof c.longitude === 'number' ? c.longitude : null,
        openingHours: c.opening_hours || null,
        services: Array.isArray(c.services)
          ? c.services.join(',')
          : '',
        isPublic:
          typeof c.is_public === 'boolean'
            ? c.is_public
            : true,
      },
    });
  }
  console.log('Clinics seeding complete.');
}

async function seedVisitGuides() {
  console.log('Clearing existing visit guides...');
  await prisma.visitGuideStep.deleteMany();
  await prisma.visitGuide.deleteMany();

  console.log('Seeding visit guides...');

  // Example guides – adjust wording later if you want
  const guides = [
    {
      slug: 'antenatal',
      title: 'Antenatal visit checklist',
      category: 'maternal',
      steps: [
        'Carry your antenatal card or ID.',
        'Note any symptoms (headache, swelling, bleeding).',
        'Do not skip your prescribed supplements.',
        'Arrive early to avoid long queues.',
      ],
    },
    {
      slug: 'child-immunization',
      title: 'Child immunization visit',
      category: 'child',
      steps: [
        'Bring your child’s immunization card.',
        'Dress the child in loose clothing.',
        'Note any previous reactions to vaccines.',
        'Plan for extra comfort (feeding, cloth, toy).',
      ],
    },
    {
      slug: 'fever-malaria',
      title: 'Fever / suspected malaria visit',
      category: 'illness',
      steps: [
        'Note when the fever started and any other symptoms.',
        'Do not self-medicate with unknown drugs.',
        'If possible, check temperature before coming.',
        'Bring any medicines you have already taken.',
      ],
    },
  ];

  for (const g of guides) {
    const vg = await prisma.visitGuide.create({
      data: {
        slug: g.slug,
        title: g.title,
        category: g.category,
        locale: 'en',
      },
    });

    let order = 1;
    for (const text of g.steps) {
      await prisma.visitGuideStep.create({
        data: {
          visitGuideId: vg.id,
          order,
          text,
        },
      });
      order += 1;
    }
  }

  console.log('Visit guides seeding complete.');
}

async function main() {
  await seedClinics();
  await seedVisitGuides();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
