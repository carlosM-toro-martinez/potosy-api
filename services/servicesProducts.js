const pool = require('../libs/Conection.js');

class productsServices {
  constructor() {
    this.sesion = {};
    this.pool = pool;
    this.pool.on('error', (err) => {
      console.log(err);
    });
  }
  async createProduct(productData) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(
        `
            INSERT INTO Products (business_id, product_details, price, product_details_en)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `,
        [
          productData.business_id,
          productData.product_details,
          productData.price,
          productData.product_details_en,
        ]
      );

      const createdProduct = result.rows[0];
      client.release();
      return createdProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(productId, updatedProductData) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(
        `
            UPDATE Products
            SET business_id = $1, product_details = $2, price = $3, product_details_en = $4
            WHERE product_id = $5
            RETURNING *;
        `,
        [
          updatedProductData.business_id,
          updatedProductData.product_details,
          updatedProductData.price,
          updatedProductData.product_details_en,
          productId,
        ]
      );

      const updatedProduct = result.rows[0];
      client.release();
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async getProductsByBusinessId(businessId) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(
        `
        SELECT *
        FROM Products
        WHERE business_id = $1;
      `,
        [businessId]
      );

      const products = result.rows;
      client.release();
      return products;
    } catch (error) {
      console.error('Error retrieving products by business_id:', error);
      throw error;
    }
  }
  async deleteProduct(productId) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(
        `
            DELETE FROM Products
            WHERE product_id = $1
            RETURNING *;
        `,
        [productId]
      );

      const deletedProduct = result.rows[0];
      client.release();
      return deletedProduct;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

module.exports = productsServices;
