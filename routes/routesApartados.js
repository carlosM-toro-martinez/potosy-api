const express = require('express');
const { body, param, validationResult } = require('express-validator');
const apartados = require('../services/servicesApartados');
const { upload, optimizeImage } = require('../middlewares/multerConfig');
const route = express.Router();

const apartado = new apartados();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

route.get('/', async (req, res) => {
  try {
    const data = await apartado.findAllSections();
    res.json(data);
  } catch (error) {
    console.error('Error fetching all sections:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.post('/icon', upload.single('image'), optimizeImage, async (req, res) => {
  const iconUrl = process.env.HOST + req?.file?.path;
  try {
    res.status(201).json(iconUrl);
  } catch (error) {
    console.error('Error adding icon section:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.post(
  '/',
  upload.single('image'),
  optimizeImage,
  [
    body('title').notEmpty().withMessage('Title is required').isString(),
    body('title_en').notEmpty().withMessage('Title_en is required').isString(),
    handleValidationErrors,
  ],
  async (req, res) => {
    const imageUrl = process.env.HOST + req?.file?.path;
    const sectionData = { ...req.body, image_url: imageUrl };
    try {
      const addedSection = await apartado.addSection(sectionData);
      res.status(201).json(addedSection);
    } catch (error) {
      console.error('Error adding section:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

route.get(
  '/:sectionId',
  [param('sectionId').isInt(), handleValidationErrors],
  async (req, res) => {
    const sectionId = req.params.sectionId;
    try {
      const section = await apartado.findSectionById(sectionId);
      if (!section) {
        res.status(404).json({ error: 'Section not found' });
      } else {
        res.json(section);
      }
    } catch (error) {
      console.error('Error fetching section by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

route.put(
  '/:sectionId',
  upload.single('image'),
  optimizeImage,
  [
    param('sectionId').isInt(),
    body('title').optional().isString(),
    body('title_en').optional().isString(),
    handleValidationErrors,
  ],
  async (req, res) => {
    const sectionId = req.params.sectionId;
    const imageUrl = process.env.HOST + req?.file?.path;
    const updatedData = { ...req.body, image_url: imageUrl };
    try {
      const updatedSection = await apartado.updateSection(
        sectionId,
        updatedData
      );
      if (!updatedSection) {
        res.status(404).json({ error: 'Section not found' });
      } else {
        res.json(updatedSection);
      }
    } catch (error) {
      console.error('Error updating section:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

route.delete(
  '/:sectionId',
  [param('sectionId').isInt(), handleValidationErrors],
  async (req, res) => {
    const sectionId = req.params.sectionId;
    try {
      const deletedSection = await apartado.deleteSection(sectionId);
      if (!deletedSection) {
        res.status(404).json({ error: 'Section not found' });
      } else {
        res.json(deletedSection);
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

module.exports = route;
