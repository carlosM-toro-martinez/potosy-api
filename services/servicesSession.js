const pool = require('../libs/Conection.js');

class Session {
    constructor() {
        this.sesion = {};
        this.pool = pool;
        this.pool.on('error', (err) => {
            console.log(err);
        });
    }

    async createUser(username, password) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(
                'INSERT INTO EstablishmentAdmin(username, password) VALUES($1, $2) RETURNING *',
                [username, password]
            );
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async findUserByUsername(username) {
        const client = await this.pool.connect();
        try {
            const result = await client.query('SELECT * FROM EstablishmentAdmin WHERE username = $1', [username]);
            return result.rows[0];
        } finally {
            client.release();
        }
    }
}

module.exports = Session;
