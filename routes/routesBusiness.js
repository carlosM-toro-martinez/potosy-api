const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Business = require('../services/servicesBusiness');
const passport = require('passport');
const { upload, optimizeImage } = require('../middlewares/multerConfig');
const route = express.Router();

const business = new Business();

// Middleware para manejar los errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

route.get('/logoUrls', async (req, res) => {
  try {
    const logoUrls = await business.getAllLogoUrls();
    res.json(logoUrls);
  } catch (error) {
    console.error('Error fetching logo URLs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.get(
  '/section/:sectionId',
  [
    param('sectionId').isInt().withMessage('Section ID must be an integer'),
    handleValidationErrors,
  ],
  async (req, res) => {
    const sectionId = req.params.sectionId;
    try {
      const businesses = await business.getBusinessesBySectionId(sectionId);
      res.json(businesses);
    } catch (error) {
      console.error('Error fetching businesses by section ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

route.get(
  '/:businessId',
  [
    param('businessId').isInt().withMessage('Business ID must be an integer'),
    handleValidationErrors,
  ],
  async (req, res) => {
    const businessId = req.params.businessId;
    try {
      const businesses = await business.getFindOneBusinesses(businessId);
      res.json(businesses);
    } catch (error) {
      console.error('Error fetching one business by business ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

route.get('/', async (req, res) => {
  try {
    const businesses = await business.getAllBusinesses();
    res.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.post(
  '/',
  upload.single('image'),
  optimizeImage,
  [
    body('name').notEmpty().withMessage('Name is required').isString(),
    handleValidationErrors,
  ],
  async (req, res) => {
    const imageUrl = process.env.HOST + req?.file?.path;
    const newBusiness = { ...req.body, logo_url: imageUrl };
    try {
      const createdBusiness = await business.createBusiness(newBusiness);
      res.status(201).json(createdBusiness);
    } catch (error) {
      console.error('Error creating business:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

route.put(
  '/:businessId',
  upload.single('image'),
  optimizeImage,
  [
    param('businessId').isInt().withMessage('Business ID must be an integer'),
    body('name').optional().isString(),
    handleValidationErrors,
  ],
  async (req, res) => {
    const businessId = req.params.businessId;
    const imageUrl = process.env.HOST + req?.file?.path;
    const updatedBusiness = { ...req.body, logo_url: imageUrl };
    try {
      const updatedBusinessResult = await business.updateBusiness(
        businessId,
        updatedBusiness
      );
      if (updatedBusinessResult) {
        res.json(updatedBusinessResult);
      } else {
        res.status(404).json({ error: 'Business not found' });
      }
    } catch (error) {
      console.error('Error updating business:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

route.put(
  '/:businessId/state',
  [
    param('businessId').isInt().withMessage('Business ID must be an integer'),
    body('state').isBoolean().withMessage('State must be a boolean'),
    handleValidationErrors,
  ],
  async (req, res) => {
    const businessId = req.params.businessId;
    const newState = req.body.state;

    try {
      const updatedBusinessResult = await business.updateBusinessState(
        businessId,
        newState
      );

      if (updatedBusinessResult) {
        res.json(updatedBusinessResult);
      } else {
        res.status(404).json({ error: 'Business not found' });
      }
    } catch (error) {
      console.error('Error updating business state:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

route.delete(
  '/:businessId',
  [
    param('businessId').isInt().withMessage('Business ID must be an integer'),
    handleValidationErrors,
  ],
  async (req, res) => {
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
  }
);

module.exports = route;
