const pool = require('../libs/Conection.js');

class apartadosServices {
  constructor() {
    this.sesion = {};
    this.pool = pool;
    this.pool.on('error', (err) => {
      console.log(err);
    });
  }

  async addSection(sectionData) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(
        'INSERT INTO Sections (title, description, image_url, title_en, description_en) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
          sectionData.title,
          sectionData.description,
          sectionData.image_url,
          sectionData.title_en,
          sectionData.description_en,
        ]
      );
      const addedSection = result.rows[0];
      client.release();
      return addedSection;
    } catch (error) {
      console.error('Error adding section:', error);
      throw error;
    }
  }

  async findAllSections() {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT * FROM Sections');
      const sections = result.rows;
      client.release();
      return sections;
    } catch (error) {
      console.error('Error fetching sections:', error);
      throw error;
    }
  }

  async findSectionById(sectionId) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(
        'SELECT * FROM Sections WHERE section_id = $1',
        [sectionId]
      );
      const section = result.rows[0];
      client.release();
      return section;
    } catch (error) {
      console.error('Error fetching section by ID:', error);
      throw error;
    }
  }

  async updateSection(sectionId, updatedData) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(
        'UPDATE Sections SET title = $1, description = $2, image_url = $3, title_en = $4, description_en = $5 WHERE section_id = $6 RETURNING *',
        [
          updatedData.title,
          updatedData.description,
          updatedData.image_url,
          updatedData.title_en,
          updatedData.description_en,
          sectionId,
        ]
      );
      const updatedSection = result.rows[0];
      client.release();
      return updatedSection;
    } catch (error) {
      console.error('Error updating section:', error);
      throw error;
    }
  }

  async deleteSection(sectionId) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(
        'DELETE FROM Sections WHERE section_id = $1 RETURNING *',
        [sectionId]
      );
      const deletedSection = result.rows[0];
      client.release();
      return deletedSection;
    } catch (error) {
      console.error('Error deleting section:', error);
      throw error;
    }
  }
}

module.exports = apartadosServices;
