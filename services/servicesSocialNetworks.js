const pool = require('../libs/Conection.js');

class promotionServices {
  constructor() {
    this.sesion = {};
    this.pool = pool;
    this.pool.on('error', (err) => {
      console.log(err);
    });
  }

  async createSocialNetworks(socialNetworkData) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(`
        INSERT INTO Social_Networks (business_id, facebook_url, instagram_url, twitter_url, tiktok_url, whatsapp_number)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `, [
        socialNetworkData.business_id,
        socialNetworkData.facebook_url,
        socialNetworkData.instagram_url,
        socialNetworkData.twitter_url,
        socialNetworkData.tiktok_url,
        socialNetworkData.whatsapp_number,
      ]);

      const createdSocialNetworks = result.rows[0];
      client.release();
      return createdSocialNetworks;
    } catch (error) {
      console.error('Error creating social networks:', error);
      throw error;
    }
  }

  async updateSocialNetworks(socialNetworksId, updatedSocialNetworkData) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(`
        UPDATE Social_Networks
        SET
          business_id = $1,
          facebook_url = $2,
          instagram_url = $3,
          twitter_url = $4,
          tiktok_url = $5,
          whatsapp_number = $6
        WHERE social_networks_id = $7
        RETURNING *;
      `, [
        updatedSocialNetworkData.business_id,
        updatedSocialNetworkData.facebook_url,
        updatedSocialNetworkData.instagram_url,
        updatedSocialNetworkData.twitter_url,
        updatedSocialNetworkData.tiktok_url,
        updatedSocialNetworkData.whatsapp_number,
        socialNetworksId,
      ]);

      const updatedSocialNetworks = result.rows[0];
      client.release();
      return updatedSocialNetworks;
    } catch (error) {
      console.error('Error updating social networks:', error);
      throw error;
    }
  }

}

module.exports = promotionServices;
