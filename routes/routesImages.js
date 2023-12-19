const express = require('express');
const route = express.Router();
const Images = require('../services/servicesImages');
const { upload, deleteImageOnError, furtherOptimizeImage } = require('../middlewares/multerConfig')

const images = new Images();

route.get('/business/:businessId', async (req, res) => {
    const businessId = req.params.businessId;
    try {
        const businessImages = await images.getImagesByBusinessId(businessId);
        res.json(businessImages);
    } catch (error) {
        console.error('Error retrieving images by business_id:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

route.get('/randomImages', async (req, res) => {
    try {
        const randomImages = await images.getRandomImages();
        res.json(randomImages);
    } catch (error) {
        console.error('Error retrieving random images:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


route.post('/', upload.single('image'), furtherOptimizeImage, async (req, res) => {
    const imageUrl = process.env.HOST + req?.file?.path;
    const imageData = { ...req.body, image_url: imageUrl };

    try {
        const createdImage = await images.createImage(imageData);
        res.status(201).json(createdImage);
    } catch (error) {
        console.error('Error creating image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

route.put('/:imageId', upload.single('image'), furtherOptimizeImage, async (req, res) => {
    const imageId = req?.params?.imageId;
    const imageUrl = process.env.HOST + req?.file?.path;
    const updatedImageData = { ...req.body, image_url: imageUrl };
    try {
        const updatedImage = await images.updateImage(imageId, updatedImageData);
        if (updatedImage) {
            res.json(updatedImage);
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
route.delete('/:imageId/:name', deleteImageOnError, async (req, res) => {
    const imageId = req.params.imageId;
    try {
        const deletedImage = await images.deleteImage(imageId);

        if (deletedImage) {
            res.json({ message: 'Image deleted successfully', deletedImage });
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = route;