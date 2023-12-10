const pool = require('../libs/Conection.js');

class businesServices {
  constructor() {
    this.sesion = {};
    this.pool = pool;
    this.pool.on('error', (err) => {
      console.log(err);
    });
  }
  async getAllBusinesses() {
    try {
      const client = await this.pool.connect();
      const result = await client.query(`
      SELECT
      b.business_id,
      b.name ,
      b.description,
      b.days_attention,
      b.logo_url,
      b.phone_number,
      b.website_url,
      b.mail,
      b.address,
      b.coordinates,
      b.state,
      s.section_id,
      jsonb_agg(DISTINCT jsonb_build_object('social_networks_id', sn.social_networks_id, 'facebook_url', sn.facebook_url, 'instagram_url', sn.instagram_url, 'twitter_url', sn.twitter_url, 'tiktok_url', sn.tiktok_url, 'whatsapp_number', sn.whatsapp_number )) AS socialNetworks,
      jsonb_agg(DISTINCT jsonb_build_object('promotion_id', p.promotion_id, 'promotion_details', p.promotion_details, 'price', p.price)) AS promotions,
      jsonb_agg(DISTINCT jsonb_build_object('product_id', pd.product_id, 'product_details', pd.product_details, 'price', pd.price)) AS products,
      jsonb_agg(DISTINCT jsonb_build_object('opening_id', oh.opening_id, 'weekend', oh.weekend, 'morning_hours', oh.morning_hours, 'afternoon_hours', oh.afternoon_hours)) AS openingHours,
      jsonb_agg(DISTINCT jsonb_build_object('image_id', i.image_id, 'image_url', i.image_url)) AS images
  FROM
      Business b
  LEFT JOIN
      Social_Networks sn ON b.business_id = sn.business_id
  LEFT JOIN
      Promotions p ON b.business_id = p.business_id
  LEFT JOIN
      Products pd ON b.business_id = pd.business_id
  LEFT JOIN
      OpeningHours oh ON b.business_id = oh.business_id
  LEFT JOIN
      Images i ON b.business_id = i.business_id
  LEFT JOIN
      Sections s ON b.section_id = s.section_id
      GROUP BY
      b.business_id, s.section_id;
      `);

      const businesses = result.rows;
      client.release();
      return businesses;
    } catch (error) {
      console.error('Error fetching businesses by section ID:', error);
      throw error;
    }
  }

  async getFindOneBusinesses(businessId) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(`
      SELECT
      b.business_id,
      b.name AS business_name,
      b.description AS business_description,
      b.days_attention,
      b.logo_url,
      b.phone_number,
      b.website_url,
      b.mail,
      b.address,
      b.coordinates,
      b.state,
      s.section_id,
      jsonb_agg(DISTINCT jsonb_build_object('social_networks_id', sn.social_networks_id, 'facebook_url', sn.facebook_url, 'instagram_url', sn.instagram_url, 'twitter_url', sn.twitter_url, 'tiktok_url', sn.tiktok_url, 'whatsapp_number', sn.whatsapp_number )) AS socialNetworks,
      jsonb_agg(DISTINCT jsonb_build_object('promotion_id', p.promotion_id, 'promotion_details', p.promotion_details, 'price', p.price)) AS promotions,
      jsonb_agg(DISTINCT jsonb_build_object('product_id', pd.product_id, 'product_details', pd.product_details, 'price', pd.price)) AS products,
      jsonb_agg(DISTINCT jsonb_build_object('opening_id', oh.opening_id, 'weekend', oh.weekend, 'morning_hours', oh.morning_hours, 'afternoon_hours', oh.afternoon_hours)) AS openingHours,
      jsonb_agg(DISTINCT jsonb_build_object('image_id', i.image_id, 'image_url', i.image_url)) AS images
  FROM
      Business b
  LEFT JOIN
      Social_Networks sn ON b.business_id = sn.business_id
  LEFT JOIN
      Promotions p ON b.business_id = p.business_id
  LEFT JOIN
      Products pd ON b.business_id = pd.business_id
  LEFT JOIN
      OpeningHours oh ON b.business_id = oh.business_id
  LEFT JOIN
      Images i ON b.business_id = i.business_id
  LEFT JOIN
      Sections s ON b.section_id = s.section_id
      WHERE
      b.business_id = $1
      GROUP BY
      b.business_id, s.section_id;
      `, [businessId]);


      const businesses = result.rows;
      client.release();
      return businesses;
    } catch (error) {
      console.error('Error fetching businesses by section ID:', error);
      throw error;
    }
  }

  async getBusinessesBySectionId(sectionId) {
    try {
      const client = await this.pool.connect();
      // Obtener todos los negocios de una sección con la información relacionada
      const result = await client.query(`
      SELECT
      b.business_id,
      b.name AS business_name,
      b.description AS business_description,
      b.days_attention,
      b.logo_url,
      b.phone_number,
      b.website_url,
      b.mail,
      b.address,
      b.coordinates,
      b.state,
      s.section_id,
      s.title AS section_title,
      s.description AS section_description,
      s.image_url AS section_image,
      jsonb_agg(DISTINCT jsonb_build_object('social_networks_id', sn.social_networks_id, 'facebook_url', sn.facebook_url, 'instagram_url', sn.instagram_url, 'twitter_url', sn.twitter_url, 'tiktok_url', sn.tiktok_url, 'whatsapp_number', sn.whatsapp_number )) AS socialNetworks,
      jsonb_agg(DISTINCT jsonb_build_object('promotion_id', p.promotion_id, 'promotion_details', p.promotion_details, 'price', p.price)) AS promotions,
      jsonb_agg(DISTINCT jsonb_build_object('product_id', pd.product_id, 'product_details', pd.product_details, 'price', pd.price)) AS products,
      jsonb_agg(DISTINCT jsonb_build_object('opening_id', oh.opening_id, 'weekend', oh.weekend, 'morning_hours', oh.morning_hours, 'afternoon_hours', oh.afternoon_hours)) AS openingHours,
      jsonb_agg(DISTINCT jsonb_build_object('image_id', i.image_id, 'image_url', i.image_url)) AS images
  FROM
      Business b
  LEFT JOIN
      Social_Networks sn ON b.business_id = sn.business_id
  LEFT JOIN
      Promotions p ON b.business_id = p.business_id
  LEFT JOIN
      Products pd ON b.business_id = pd.business_id
  LEFT JOIN
      OpeningHours oh ON b.business_id = oh.business_id
  LEFT JOIN
      Images i ON b.business_id = i.business_id
  LEFT JOIN
      Sections s ON b.section_id = s.section_id
  WHERE
      b.section_id = $1
  GROUP BY
      b.business_id, s.section_id;
  
      `, [sectionId]);

      const businesses = result.rows;
      client.release();
      return businesses;
    } catch (error) {
      console.error('Error fetching businesses by section ID:', error);
      throw error;
    }
  }

  async createBusiness(newBusiness) {
    try {
      const client = await this.pool.connect();

      // Crear nuevo negocio en la tabla "Business"
      const businessResult = await client.query(`
        INSERT INTO Business (
          name, description, days_attention, logo_url, mail, phone_number,
          website_url, address, coordinates, section_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        ) RETURNING *;
      `, [
        newBusiness.name,
        newBusiness.description,
        newBusiness.days_attention,
        newBusiness.logo_url,
        newBusiness.mail,
        newBusiness.phone_number,
        newBusiness.website_url,
        newBusiness.address,
        newBusiness.coordinates,
        newBusiness.section_id
      ]);

      const createdBusiness = businessResult.rows[0];
      client.release();
      return createdBusiness;
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  }

  async updateBusiness(businessId, updatedBusiness) {
    try {
      const client = await this.pool.connect();

      // Actualizar negocio en la tabla "Business"
      const businessResult = await client.query(`
        UPDATE Business
        SET
          name = $1,
          description = $2,
          days_attention = $3,
          logo_url = $4,
          phone_number = $5,
          website_url = $6,
          address = $7,
          coordinates = $8,
          state = $9,
          section_id = $10
        WHERE business_id = $11
        RETURNING *;
      `, [
        updatedBusiness.name,
        updatedBusiness.description,
        updatedBusiness.days_attention,
        updatedBusiness.logo_url,
        updatedBusiness.phone_number,
        updatedBusiness.website_url,
        updatedBusiness.address,
        updatedBusiness.coordinates,
        updatedBusiness.state,
        updatedBusiness.section_id,
        businessId
      ]);

      const updatedBusinessResult = businessResult.rows[0];
      client.release();
      return updatedBusinessResult;
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  }
  async updateBusinessState(businessId, newState) {
    try {
      const client = await this.pool.connect();
      const businessResult = await client.query(`
        UPDATE Business
        SET state = $1
        WHERE business_id = $2
        RETURNING *;
      `, [newState, businessId]);

      const updatedBusinessResult = businessResult.rows[0];
      client.release();
      return updatedBusinessResult;
    } catch (error) {
      console.error('Error updating business state:', error);
      throw error;
    }
  }

  async deleteBusiness(businessId) {
    try {
      const client = await this.pool.connect();

      // Eliminar negocio de la tabla "Business"
      const businessResult = await client.query(`
        DELETE FROM Business
        WHERE business_id = $1
        RETURNING *;
      `, [businessId]);

      const deletedBusiness = businessResult.rows[0];
      client.release();
      return deletedBusiness;
    } catch (error) {
      console.error('Error deleting business:', error);
      throw error;
    }
  }
}

module.exports = businesServices;
