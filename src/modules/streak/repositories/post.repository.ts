import { Pool } from 'pg';
import { db } from 'src/config/db';
import { Post } from '../entities';

export class PostRepository {
  constructor(private readonly database: Pool) {}

  async getPostByBeehivId(beeHivId: string): Promise<Post | null> {
    const result = await this.database.query(
      `SELECT * FROM posts WHERE "beehivId" = $1;`,
      [beeHivId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new Post(
      row.id,
      row.title,
      row.publishedAt,
      row.beeHivId,
      row.createdAt,
      row.updatedAt,
    );
  }

  async createPost(beehivId: string, title: string, publishedAt: string) {
    const result = await this.database.query(
      `INSERT INTO posts ("beehivId", title, "publishedAt") VALUES ($1,$2,$3) RETURNING *;`,
      [beehivId, title, publishedAt],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new Post(
      row.id,
      row.title,
      row.publishedAt,
      row.beehivId,
      row.createdAt,
      row.updatedAt,
    );
  }
}

export const makePostRepository = () => {
  const dbPool = db;

  return new PostRepository(dbPool);
};
