/* eslint-disable camelcase */
import 'dotenv/config';
import { Pool } from 'pg';
import { v7 as uuidv7 } from 'uuid';

class CalenderRepositories {
  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async countUpcomingMeals({ userId, tomorrowStr }) {
    const query = {
      text: 'SELECT COUNT(*) FROM SCHEDULED_MEALS WHERE user_id = $1 AND scheduled_date >= $2;',
      values: [userId, tomorrowStr],
    };

    const result = await this.pool.query(query);

    return result.rows[0].count;
  }

  async saveMealPlan({ userId, data }) {
    if (!data || data.length === 0) return null;

    const values = [];
    const placeholders = [];
    let paramIndex = 1;

    data.forEach((meal) => {
      placeholders.push(
        `($${paramIndex++}, $${paramIndex++},$${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`,
      );

      values.push(
        uuidv7(),
        userId,
        meal.scheduled_date,
        meal.meal_type,
        meal.recipe_name,
        meal.minutes,
        meal.calories,
        meal.ingredients,
        meal.cooking_steps,
      );
    });

    const query = {
      text: `INSERT INTO SCHEDULED_MEALS 
              (id, user_id, scheduled_date, meal_type, recipe_name, minutes, calories, ingredients, cooking_steps) 
              VALUES ${placeholders.join(', ')}
              RETURNING *`,
      values: values,
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getMealPlan({ userId, start_date, end_date }) {
    const query = {
      text: `SELECT id, scheduled_date, meal_type, recipe_name, minutes, calories, ingredients, cooking_steps 
            FROM SCHEDULED_MEALS WHERE user_id = $1 AND scheduled_date >= $2 AND scheduled_date <= $3 
            ORDER BY scheduled_date ASC;`,
      values: [userId, start_date, end_date],
    };

    const results = await this.pool.query(query);
    return results.rows;
  }

  async verifyOwnership({ userId, targetScheduleIds }) {
    const query = {
      text: 'SELECT id FROM SCHEDULED_MEALS WHERE id = ANY($1::uuid[]) AND user_id = $2::uuid;',
      values: [targetScheduleIds, userId],
    };

    const result = await this.pool.query(query);
    return result.rows.length === targetScheduleIds.length;
  }

  async updateMealPlan({ userId, data }) {
    const values = [];
    const queryPlaceholders = [];
    let paramIndex = 1;

    data.forEach((item) => {
      queryPlaceholders.push(
        `($${paramIndex++}::uuid, $${paramIndex++}::text, $${paramIndex++}::smallint, $${paramIndex++}::smallint, $${paramIndex++}::text[], $${paramIndex++}::text[])`,
      );
      values.push(
        item.target_schedule_id,
        item.recipe_name,
        item.minutes,
        item.calories,
        item.ingredients,
        item.cooking_steps,
      );
    });

    values.push(userId);

    const queryText = `
      UPDATE SCHEDULED_MEALS as sm
      SET 
          recipe_name = data.recipe_name,
          minutes = data.minutes,
          calories = data.calories,
          ingredients = data.ingredients,
          cooking_steps = data.cooking_steps
      FROM (VALUES 
          ${queryPlaceholders.join(', ')}
      ) AS data(target_schedule_id, recipe_name, minutes, calories, ingredients, cooking_steps)
      WHERE sm.id = data.target_schedule_id AND sm.user_id = $${paramIndex}::uuid;
    `;

    const result = await this.pool.query({ text: queryText, values });
    return result.rowCount;
  }

  async deleteMealPlanById({ scheduleId, userId }) {
    const query = {
      text: 'DELETE FROM SCHEDULED_MEALS WHERE id = $1 AND user_id = $2 RETURNING id;',
      values: [scheduleId, userId],
    };

    const results = await this.pool.query(query);
    return results.rows[0]?.id || null;
  }

  async deleteUpcomingMeal({ userId, tomorrowStr }) {
    const query = {
      text: 'DELETE FROM SCHEDULED_MEALS WHERE user_id = $1 AND scheduled_date >= $2;',
      values: [userId, tomorrowStr],
    };

    const results = await this.pool.query(query);
    return results.rowCount;
  }
}

export default new CalenderRepositories();
