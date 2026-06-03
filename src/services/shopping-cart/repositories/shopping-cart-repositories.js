import 'dotenv/config';
import { Pool } from 'pg';

class shoppingCartRepositories {
  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async getFutureMealPlan({ userId, tomorrowStr, targetDayStr }) {
    const query = {
      text: `SELECT id, recipe_name, ingredients FROM SCHEDULED_MEALS 
            WHERE user_id = $1 AND scheduled_date BETWEEN $2 AND $3;`,
      values: [userId, tomorrowStr, targetDayStr],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async generateNewCart({ userId, valuesStr, queryParams, stateData }) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN'); // MULAI PROTEKSI

      // 1. Hapus yang lama
      await client.query(
        'DELETE FROM shopping_cart_items WHERE user_id = $1;',
        [userId],
      );
      await client.query(
        'DELETE FROM shopping_cart_state WHERE user_id = $1;',
        [userId],
      );

      // 2. Buat yang baru
      const query = {
        text: `INSERT INTO shopping_cart_items (id, user_id, ingredient_name, required_amount, recipe_sources, is_checked)
                    VALUES ${valuesStr} RETURNING id;`,
        values: queryParams,
      };

      const stateQuery = {
        text: `INSERT INTO SHOPPING_CART_STATE (id, user_id, start_date, end_date, generated_at) 
                    VALUES ($1, $2, $3, $4, NOW());`,
        values: [
          stateData.id,
          stateData.userId,
          stateData.startDate,
          stateData.endDate,
        ],
      };

      await client.query(stateQuery);
      const result = await client.query(query);

      await client.query('COMMIT'); // KUNCI DISIMPAN PERMANEN

      return result.rowCount;
    } catch (error) {
      await client.query('ROLLBACK'); // KEMBALIKAN KE KONDISI SEMULA JIKA ADA YANG GAGAL
      throw error;
    } finally {
      client.release();
    }
  }

  //////////////////////////////////////////
  //////////////////////////////////////////
  //////////////////////////////////////////
  //////////////////////////////////////////
  //////////////////////////////////////////

  async getCartState(userId) {
    const query = {
      text: `SELECT start_date, end_date, generated_at 
            FROM shopping_cart_state WHERE user_id = $1
            LIMIT 1;`,
      values: [userId],
    };
    const result = await this.pool.query(query);
    return result.rows[0]; // Retur undefined jika tidak ada
  }

  async getShoppingCart(userId) {
    const query = {
      text: `SELECT id, ingredient_name, required_amount, recipe_sources, is_checked FROM SHOPPING_CART_ITEMS 
            WHERE user_id = $1 ORDER BY is_checked ASC, ingredient_name ASC;`,
      values: [userId],
    };

    const results = await this.pool.query(query);
    return results.rows;
  }

  async getCalendarLastModified({ userId, startDate, endDate }) {
    const query = {
      text: `SELECT MAX(updated_at) as calendar_last_modified 
            FROM SCHEDULED_MEALS 
            WHERE user_id = $1 
            AND scheduled_date >= $2 
            AND scheduled_date <= $3;`,
      values: [userId, startDate, endDate],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getLatestMealPlanState(userId) {
    const query = {
      text: `SELECT generated_at 
            FROM CALENDAR_STATES
            WHERE user_id = $1  
            LIMIT 1;`,
      values: [userId],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async toggleCart({ itemId, userId }) {
    const query = {
      text: `UPDATE SHOPPING_CART_ITEMS SET is_checked = NOT is_checked 
            WHERE id = $1 AND user_id = $2 RETURNING is_checked;`,
      values: [itemId, userId],
    };

    const results = await this.pool.query(query);
    return results.rows[0];
  }
}

export default new shoppingCartRepositories();
