import 'dotenv/config';
import { Pool } from 'pg';

class shoppingCartRepositories {
  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async addShoppingCart({ valuesStr, queryParams }) {
    const query = {
      text: `INSERT INTO shopping_cart_items (id, user_id, ingredient_name, required_amount, recipe_sources, is_checked)
            VALUES ${valuesStr} RETURNING id;`,
      values: queryParams,
    };
    const result = await this.pool.query(query);
    return result.rowCount;
  }

  async deleteCurrentShoppingCart(userId) {
    const query = {
      text: 'DELETE FROM SHOPPING_CART_ITEMS WHERE user_id = $1;',
      values: [userId],
    };

    const result = await this.pool.query(query);
    return result.rowCount;
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
}

export default new shoppingCartRepositories();
