const express = require('express');
const route = express.Router();
const Products = require('../services/servicesProducts');

const products = new Products();

route.get('/business/:businessId', async (req, res) => {
    const businessId = req.params.businessId;
    try {
        const businessProducts = await products.getProductsByBusinessId(businessId);
        res.json(businessProducts);
    } catch (error) {
        console.error('Error retrieving products by business_id:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

route.post('/', async (req, res) => {
    const productData = req.body;
    try {
        const createdProduct = await products.createProduct(productData);
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

route.put('/:productId', async (req, res) => {
    const productId = req.params.productId;
    const updatedProductData = req.body;
    try {
        const updatedProduct = await products.updateProduct(productId, updatedProductData);
        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

route.delete('/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const deletedProduct = await products.deleteProduct(productId);

        if (deletedProduct) {
            res.json({ message: 'Product deleted successfully', deletedProduct });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = route;