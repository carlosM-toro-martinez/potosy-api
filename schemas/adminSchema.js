const conexion = require('../libs/Conection');

async function createAdmin() {
    try {
        const client = await conexion.connect();

        // Crear la tabla "Admin"
        await client.query(`
      CREATE TABLE IF NOT EXISTS Admin (
        admin_id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);

        client.release();
        console.log('table "admin" create success');
    } catch (error) {
        console.error('Error al crear la tabla "Admin":', error);
    }
}

module.exports = createAdmin;
