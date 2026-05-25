import 'dotenv/config';
import { Pool } from 'pg';

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
}

export default new CalenderRepositories();
