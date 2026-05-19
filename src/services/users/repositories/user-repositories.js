import 'dotenv/config';
import { Pool } from 'pg';

class UserRepositories {
  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async addUser(id) {
    const tempUsername = 'user';
    const tempFullname = 'New User';

    const query = {
      text: 'INSERT INTO users (id, username, fullname) VALUES ($1, $2, $3) RETURNING id, username, fullname',
      values: [id, tempUsername, tempFullname],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }
}

export default new UserRepositories();
