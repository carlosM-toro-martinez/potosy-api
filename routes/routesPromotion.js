const express = require('express');
const route = express.Router();
const Promotions = require('../services/servicesPromotion');

const promotions = new Promotions();

route.get('/business/:businessId', async (req, res) => {
    const businessId = req.params.businessId;
    try {
        const businessPromotions = await promotions.getPromotionsByBusinessId(businessId);
        res.json(businessPromotions);
    } catch (error) {
        console.error('Error retrieving promotions by business_id:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

route.post('/', async (req, res) => {
    const promotionData = req.body;
    try {
        const createdPromotion = await promotions.createPromotion(promotionData);
        res.status(201).json(createdPromotion);
    } catch (error) {
        console.error('Error creating promotion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

route.put('/:promotionId', async (req, res) => {
    const promotionId = req.params.promotionId;
    const updatedPromotionData = req.body;
    try {
        const updatedPromotion = await promotions.updatePromotion(promotionId, updatedPromotionData);
        if (updatedPromotion) {
            res.json(updatedPromotion);
        } else {
            res.status(404).json({ error: 'Promotion not found' });
        }
    } catch (error) {
        console.error('Error updating promotion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

route.delete('/:promotionId', async (req, res) => {
    const promotionId = req.params.promotionId;

    try {
        const deletedPromotion = await promotions.deletePromotion(promotionId);

        if (deletedPromotion) {
            res.json({ message: 'Promotion deleted successfully', deletedPromotion });
        } else {
            res.status(404).json({ error: 'Promotion not found' });
        }
    } catch (error) {
        console.error('Error deleting promotion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = route;