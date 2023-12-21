const { Pool } = require('pg');
const { config } = require('../config/config');

const URI = `postgres://${config.dbUser}:${config.dbPass}@${config.dbHost}:${config.dbPort}/${config.dbName}`;
// const URI = `postgres://carlostoro:sI7BJq2RV9ivU07AEoPzZG0xTuAUN9Pz@dpg-cf2panarrk0bppcc9cg0-a.oregon-postgres.render.com/my_store_z87a?ssl=true`;

const pool = new Pool({ connectionString: URI });
pool.on('error', (err, client) => {
    console.error('Error en el pool de conexiones:', err);
    process.exit(-1);
});


module.exports = pool;
