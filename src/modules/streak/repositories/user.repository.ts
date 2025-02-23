import { Pool } from 'pg';
import { db } from 'src/config';

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
      row.currentStreak,
      row.createdAt,
      row.updatedAt,
    );
  }

  async getUserById(userId: string): Promise<User | null> {
    const result = await this.database.query(
      `SELECT * FROM users WHERE id = $1;`,
      [userId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new User(
      row.id,
      row.email,
      row.recordStreak,
      row.currentStreak,
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
      row.currentStreak,
      row.createdAt,
      row.updatedAt,
    );
  }

  async updateUser(user: User): Promise<User | null> {
    const result = await this.database.query(
      `UPDATE users SET 
      email = $1, "recordStreak" = $2, "currentStreak" = $3, "updatedAt" = $4
      WHERE id = $5
      RETURNING *;`,
      [
        user.email,
        user.recordStreak,
        user.currentStreak,
        new Date().toISOString(),
        user.id,
      ],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new User(
      row.id,
      row.email,
      row.recordStreak,
      row.currentStreak,
      row.createdAt,
      row.updatedAt,
    );
  }

  async getTotalUsers(): Promise<number> {
    const result = await this.database.query(`SELECT COUNT(*) FROM users;`);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return row.count;
  }

  async getUserRanking(
    rank: 'currentStreak' | 'recordStreak',
    postId: string,
    startAt: string,
    endAt,
  ): Promise<User[]> {
    const filters = [];
    if (postId) filters.push(postId);
    if (startAt) filters.push(startAt);
    if (endAt) filters.push(endAt);

    const result = postId
      ? await this.database.query(
          `SELECT users.* FROM reads
          JOIN users ON reads."userId" = users.id
          WHERE 
          reads."postId" = $1
          ${startAt || endAt ? 'AND' : ''}
          ${startAt && !endAt ? `reads."createdAt" >= $2` : ''}
          ${!startAt && endAt ? `reads."createdAt" <= $2` : ''}
          ${startAt && endAt ? 'reads."createdAt" BETWEEN $2 AND $3' : ''}
          ORDER BY "${rank}" DESC`,
          filters,
        )
      : await this.database.query(
          `SELECT * FROM users 
          ${startAt || endAt ? 'WHERE' : ''}
          ${startAt && !endAt ? `reads."createdAt" >= $1` : ''}
          ${!startAt && endAt ? `reads."createdAt" <= $1` : ''}
          ${startAt && endAt ? 'reads."createdAt" BETWEEN $1 AND $2' : ''}
          ORDER BY "${rank}" DESC`,
          filters,
        );

    if (result.rows.length === 0) {
      return [];
    }

    return result.rows.map((row) => {
      return new User(
        row.id,
        row.email,
        row.recordStreak,
        row.currentStreak,
        row.createdAt,
        row.updatedAt,
      );
    });
  }
}

export const makeUserRepository = () => {
  const dbPool = db;

  return new UserRepository(dbPool);
};
