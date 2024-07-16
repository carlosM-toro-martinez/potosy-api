const conexion = require('../libs/Conection');

async function createNews() {
  try {
    const client = await conexion.connect();

    // Crear la tabla "Novedades"
    await client.query(`
      CREATE TABLE IF NOT EXISTS News (
        novelty_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        title_en VARCHAR(255),
        description TEXT,
        description_en TEXT,
        address VARCHAR(255),
        time TIME,
        date DATE,
        promotional_image_url VARCHAR(255)
      )
    `);

    client.release();
    console.log('table "news" create success');
  } catch (error) {
    console.error('Error al crear la tabla "Novedades":', error);
  }
}

module.exports = createNews;
