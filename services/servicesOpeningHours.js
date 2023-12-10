const pool = require('../libs/Conection.js');

class OpeningHoursServices {
    constructor() {
        this.sesion = {};
        this.pool = pool;
        this.pool.on('error', (err) => {
            console.log(err);
        });
    }

    async createOpeningHour(openingHourData) {
        try {
            const client = await this.pool.connect();
            const result = await client.query(`
                INSERT INTO OpeningHours (business_id, weekend, morning_hours, afternoon_hours)
                VALUES ($1, $2, $3, $4)
                RETURNING *;
            `, [openingHourData.business_id, openingHourData.weekend, openingHourData.morning_hours, openingHourData.afternoon_hours]);

            const createdOpeningHour = result.rows[0];
            client.release();
            return createdOpeningHour;
        } catch (error) {
            console.error('Error creating opening hour:', error);
            throw error;
        }
    }

    async updateOpeningHour(openingHourId, updatedOpeningHourData) {
        try {
            const client = await this.pool.connect();
            const result = await client.query(`
                UPDATE OpeningHours
                SET business_id = $1, weekend = $2, morning_hours = $3, afternoon_hours = $4
                WHERE opening_id = $5
                RETURNING *;
            `, [updatedOpeningHourData.business_id, updatedOpeningHourData.weekend, updatedOpeningHourData.morning_hours, updatedOpeningHourData.afternoon_hours, openingHourId]);

            const updatedOpeningHour = result.rows[0];
            client.release();
            return updatedOpeningHour;
        } catch (error) {
            console.error('Error updating opening hour:', error);
            throw error;
        }
    }

}

module.exports = OpeningHoursServices;