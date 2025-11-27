// src/routes/visitGuides.js
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/visit-guides
 * Return a list of available guides (no steps, just meta)
 */
router.get('/', async (req, res) => {
  try {
    const guides = await prisma.visitGuide.findMany({
      where: { locale: 'en' },
      orderBy: { title: 'asc' },
    });

    res.json(
      guides.map((g) => ({
        id: g.id,
        slug: g.slug,
        title: g.title,
        category: g.category,
      }))
    );
  } catch (err) {
    console.error('Error fetching visit guides:', err);
    res.status(500).json({ error: 'Unable to fetch visit guides' });
  }
});

/**
 * GET /api/visit-guides/:slug
 * Return a single guide + its steps
 */
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const guide = await prisma.visitGuide.findFirst({
      where: { slug, locale: 'en' },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    res.json({
      id: guide.id,
      slug: guide.slug,
      title: guide.title,
      category: guide.category,
      steps: guide.steps.map((s) => ({
        id: s.id,
        order: s.order,
        text: s.text,
      })),
    });
  } catch (err) {
    console.error('Error fetching visit guide:', err);
    res.status(500).json({ error: 'Unable to fetch this guide' });
  }
});

module.exports = router;
