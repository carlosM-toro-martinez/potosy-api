const pool = require('../libs/Conection.js');

class adminsServices {
  constructor() {
    this.sesion = {};
    this.pool = pool;
    this.pool.on('error', (err) => {
      console.log(err);
    });
  }

  async getAllAdmins() {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT * FROM EstablishmentAdmin');
      const admins = result.rows;
      client.release();
      return admins;
    } catch (error) {
      console.error('Error fetching all admins:', error);
      throw error;
    }
  }

  async getAdminById(adminId) {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT * FROM EstablishmentAdmin WHERE admin_id = $1', [adminId]);
      const admin = result.rows[0];
      client.release();
      return admin;
    } catch (error) {
      console.error('Error fetching admin by ID:', error);
      throw error;
    }
  }

  async createAdmin(newAdmin) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(`
                INSERT INTO EstablishmentAdmin (username, password, business_id)
                VALUES ($1, $2, $3)
                RETURNING *;
            `, [newAdmin.username, newAdmin.password, newAdmin.business_id]);

      const createdAdmin = result.rows[0];
      client.release();
      return createdAdmin;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  }

  async updateAdmin(adminId, updatedAdmin) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(`
                UPDATE EstablishmentAdmin
                SET username = $1, password = $2, business_id = $3
                WHERE admin_id = $4
                RETURNING *;
            `, [updatedAdmin.username, updatedAdmin.password, updatedAdmin.business_id, adminId]);

      const updatedAdminResult = result.rows[0];
      client.release();
      return updatedAdminResult;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  }

  async deleteAdmin(adminId) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(`
                DELETE FROM EstablishmentAdmin
                WHERE admin_id = $1
                RETURNING *;
            `, [adminId]);

      const deletedAdmin = result.rows[0];
      client.release();
      return deletedAdmin;
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  }
}

module.exports = adminsServices;
