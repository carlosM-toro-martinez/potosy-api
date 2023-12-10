const conexion = require('../libs/Conection');

async function createBusiness() {
  try {

    const client = await conexion.connect();
    // Create table "Sections"
    await client.query(`
      CREATE TABLE IF NOT EXISTS Sections (
        section_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255)
      )
    `);
    // Create table "Business"
    await client.query(`
      CREATE TABLE IF NOT EXISTS Business (
        business_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        days_attention VARCHAR(255),
        logo_url VARCHAR(255),
        phone_number VARCHAR(20),
        website_url VARCHAR(255),
        mail VARCHAR(255),
        address VARCHAR(255),
        coordinates POINT,
        state BOOLEAN DEFAULT false,
        section_id INT REFERENCES Sections(section_id) ON DELETE CASCADE
      )
    `);

    await client.query(`
    CREATE TABLE IF NOT EXISTS EstablishmentAdmin (
      admin_id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      business_id INT REFERENCES Business(business_id) ON DELETE CASCADE
    )
  `);

    // Create table "Social_Networks"
    await client.query(`
        CREATE TABLE IF NOT EXISTS Social_Networks (
          social_networks_id SERIAL PRIMARY KEY,
          business_id INT REFERENCES Business(business_id) ON DELETE CASCADE,
          facebook_url VARCHAR(255),
          instagram_url VARCHAR(255),
          twitter_url VARCHAR(255),
          tiktok_url VARCHAR(255),
          whatsapp_number VARCHAR(20)
        )
      `);

    // Create table "Promotions"
    await client.query(`
      CREATE TABLE IF NOT EXISTS Promotions (
        promotion_id SERIAL PRIMARY KEY,
        business_id INT REFERENCES Business(business_id) ON DELETE CASCADE,
        promotion_details TEXT,
        price TEXT
      )
    `);

    // Create table "Products"
    await client.query(`
      CREATE TABLE IF NOT EXISTS Products (
        product_id SERIAL PRIMARY KEY,
        business_id INT REFERENCES Business(business_id) ON DELETE CASCADE,
        product_details TEXT,
        price TEXT
      )
    `);

    // Create table "OpeningHours"
    await client.query(`
      CREATE TABLE IF NOT EXISTS OpeningHours (
        opening_id SERIAL PRIMARY KEY,
        business_id INT REFERENCES Business(business_id) ON DELETE CASCADE,
        weekend VARCHAR(255),
        morning_hours VARCHAR(255)[],
        afternoon_hours VARCHAR(255)[]
      )
    `);

    // Create table "Images"
    await client.query(`
      CREATE TABLE IF NOT EXISTS Images (
        image_id SERIAL PRIMARY KEY,
        business_id INT REFERENCES Business(business_id) ON DELETE CASCADE,
        image_url VARCHAR(255)
      )
    `);

    client.release();
    console.log('table bussines create success');
  } catch (error) {
    console.error('Error al crear el esquema:', error);
  }
}

module.exports = createBusiness;
