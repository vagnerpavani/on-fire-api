import { Pool } from 'pg';
import { db } from 'src/config/db';
import { User } from 'src/modules/streak/entities';

export class UserRepository {
  constructor(private readonly database: Pool) {}

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.database.query(
      `SELECT * FROM users WHERE email = $1;`,
      [email],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new User(
      row.id,
      row.email,
      row.recordStreak,
      row.createdAt,
      row.updatedAt,
    );
  }

  async createUser(email: string): Promise<User | null> {
    const result = await this.database.query(
      `INSERT INTO users ("email") 
        VALUES ($1) RETURNING *;`,
      [email],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new User(
      row.id,
      row.email,
      row.recordStreak,
      row.createdAt,
      row.updatedAt,
    );
  }
}

export const makeUserRepository = () => {
  const dbPool = db;

  return new UserRepository(dbPool);
};
