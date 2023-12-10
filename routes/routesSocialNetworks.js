const express = require('express');
const route = express.Router();
const SocialNet = require('../services/servicesSocialNetworks');

const socialNet = new SocialNet();

// Endpoint para crear redes sociales
route.post('/', async (req, res) => {
    try {
        const socialNetworkData = req.body; // Asumiendo que los datos se envían en el cuerpo de la solicitud
        const createdSocialNetworks = await socialNet.createSocialNetworks(socialNetworkData);
        res.json(createdSocialNetworks);
    } catch (error) {
        console.error('Error creating social networks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint para actualizar redes sociales
route.put('/:id', async (req, res) => {
    try {
        const socialNetworksId = req.params.id;
        const updatedSocialNetworkData = req.body; // Asumiendo que los datos se envían en el cuerpo de la solicitud
        const updatedSocialNetworks = await socialNet.updateSocialNetworks(socialNetworksId, updatedSocialNetworkData);
        res.json(updatedSocialNetworks);
    } catch (error) {
        console.error('Error updating social networks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = route;