const express = require('express');
const apartados = require('../services/servicesApartados');
const { upload } = require('../middlewares/multerConfig');
const route = express.Router();

const apartado = new apartados();

route.get('/', async (req, res) => {
  try {
    const data = await apartado.findAllSections();
    res.json(data);
  } catch (error) {
    console.error('Error fetching all sections:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.post('/', upload.single('image'), async (req, res) => {
  const imageUrl = process.env.HOST + req?.file?.path
  const sectionData = { ...req.body, image_url: imageUrl };
  try {
    const addedSection = await apartado.addSection(sectionData);
    res.status(201).json(addedSection);
  } catch (error) {
    console.error('Error adding section:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.get('/:sectionId', async (req, res) => {
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
});

route.put('/:sectionId', upload.single('image'), async (req, res) => {
  const sectionId = req.params.sectionId;
  const imageUrl = process.env.HOST + req?.file?.path
  const updatedData = { ...req.body, image_url: imageUrl };
  try {
    const updatedSection = await apartado.updateSection(sectionId, updatedData);
    if (!updatedSection) {
      res.status(404).json({ error: 'Section not found' });
    } else {
      res.json(updatedSection);
    }
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.delete('/:sectionId', async (req, res) => {
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
});

module.exports = route;
