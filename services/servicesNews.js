const pool = require('../libs/Conection.js');

class newsServices {
  constructor() {
    this.sesion = {};
    this.pool = pool;
    this.pool.on('error', (err) => {
      console.log(err);
    });
  }

  async createNews(newNews) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(
        `
              INSERT INTO News (title, description, address, time, date, promotional_image_url, description_en, title_en)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
              RETURNING *;
          `,
        [
          newNews.title,
          newNews.description,
          newNews.address,
          newNews.time,
          newNews.date,
          newNews.promotional_image_url,
          newNews.description_en,
          newNews.title_en,
        ]
      );

      const createdNews = result.rows[0];
      client.release();
      return createdNews;
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  }

  async getAllNews() {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT * FROM News');
      const allNews = result.rows;
      client.release();
      return allNews;
    } catch (error) {
      console.error('Error fetching all news:', error);
      throw error;
    }
  }

  async getNewsById(newsId) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(
        'SELECT * FROM News WHERE novelty_id = $1',
        [newsId]
      );
      const news = result.rows[0];
      client.release();
      return news;
    } catch (error) {
      console.error('Error fetching news by ID:', error);
      throw error;
    }
  }

  async updateNews(newsId, updatedNews) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(
        `
              UPDATE News
              SET title = $1, description = $2, address = $3, time = $4, date = $5, promotional_image_url = $6, description_en = $7, title_en = $8
              WHERE novelty_id = $9
              RETURNING *;
          `,
        [
          updatedNews.title,
          updatedNews.description,
          updatedNews.address,
          updatedNews.time,
          updatedNews.date,
          updatedNews.promotional_image_url,
          updatedNews.description_en,
          updatedNews.title_en,
          newsId,
        ]
      );

      const updatedNewsResult = result.rows[0];
      client.release();
      return updatedNewsResult;
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  }

  // Delete
  async deleteNews(newsId) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(
        'DELETE FROM News WHERE novelty_id = $1 RETURNING *',
        [newsId]
      );
      const deletedNews = result.rows[0];
      client.release();
      return deletedNews;
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  }
}

module.exports = newsServices;
