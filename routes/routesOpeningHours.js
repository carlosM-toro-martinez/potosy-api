const express = require('express');
const route = express.Router();
const OpeningHours = require('../services/servicesOpeningHours');

const openingHours = new OpeningHours();

route.post('/', async (req, res) => {
    const openingHourData = req.body;
    try {
        const createdOpeningHour = await openingHours.createOpeningHour(openingHourData);
        res.status(201).json(createdOpeningHour);
    } catch (error) {
        console.error('Error creating opening hour:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

route.put('/:openingHourId', async (req, res) => {
    const openingHourId = req.params.openingHourId;
    const updatedOpeningHourData = req.body;
    try {
        const updatedOpeningHour = await openingHours.updateOpeningHour(openingHourId, updatedOpeningHourData);
        if (updatedOpeningHour) {
            res.json(updatedOpeningHour);
        } else {
            res.status(404).json({ error: 'Opening hour not found' });
        }
    } catch (error) {
        console.error('Error updating opening hour:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = route;