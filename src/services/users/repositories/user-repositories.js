import { Pool } from 'pg';

class UserRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

export default UserRepositories;
