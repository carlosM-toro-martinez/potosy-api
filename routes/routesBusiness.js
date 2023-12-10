const express = require('express');
const route = express.Router();
const Business = require('../services/servicesBusiness');
const passport = require('passport');
const { upload } = require('../middlewares/multerConfig')

const business = new Business();


route.get('/section/:sectionId', async (req, res) => {
  const sectionId = req.params.sectionId;
  try {
    const businesses = await business.getBusinessesBySectionId(sectionId);
    res.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses by section ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//passport.authenticate('jwt', { session: false }),
route.get('/:businessId', async (req, res) => {
  const businessId = req.params.businessId;
  try {
    const businesses = await business.getFindOneBusinesses(businessId);
    res.json(businesses);
  } catch (error) {
    console.error('Error fetching one businesses by business ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.get('/', async (req, res) => {
  try {
    const businesses = await business.getAllBusinesses();
    res.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.post('/', upload.single('image'), async (req, res) => {
  const imageUrl = process.env.HOST + req?.file?.path
  const newBusiness = { ...req.body, logo_url: imageUrl };
  try {
    const createdBusiness = await business.createBusiness(newBusiness);
    res.status(201).json(createdBusiness);
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.put('/:businessId', upload.single('image'), async (req, res) => {
  const businessId = req.params.businessId;
  const imageUrl = process.env.HOST + req?.file?.path;
  const updatedBusiness = { ...req.body, logo_url: imageUrl };
  try {
    const updatedBusinessResult = await business.updateBusiness(businessId, updatedBusiness);
    if (updatedBusinessResult) {
      res.json(updatedBusinessResult);
    } else {
      res.status(404).json({ error: 'Business not found' });
    }
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.put('/:businessId/state', async (req, res) => {
  const businessId = req.params.businessId;
  const newState = req.body.state;

  try {
    const updatedBusinessResult = await business.updateBusinessState(businessId, newState);

    if (updatedBusinessResult) {
      res.json(updatedBusinessResult);
    } else {
      res.status(404).json({ error: 'Business not found' });
    }
  } catch (error) {
    console.error('Error updating business state:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.delete('/:businessId', async (req, res) => {
  const businessId = req.params.businessId;
  try {
    const deletedBusiness = await business.deleteBusiness(businessId);
    if (deletedBusiness) {
      res.json(deletedBusiness);
    } else {
      res.status(404).json({ error: 'Business not found' });
    }
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = route;
