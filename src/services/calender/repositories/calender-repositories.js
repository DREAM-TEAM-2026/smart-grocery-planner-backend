import 'dotenv/config';
import { Pool } from 'pg';
import { v7 as uuidv7 } from 'uuid';

class CalenderRepositories {
  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async countUpcomingMeals(id) {
    const query = {
      text: "SELECT COUNT(*) FROM SCHEDULED_MEALS WHERE user_id = $1 AND scheduled_date >= CURRENT_DATE + INTERVAL '1 day';",
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0].count;
  }

  async saveMealPlan({ id, data }) {
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
        id,
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
}

export default new CalenderRepositories();
