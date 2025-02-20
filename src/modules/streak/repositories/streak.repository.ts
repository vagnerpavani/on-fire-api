import { Pool } from 'pg';
import { db } from 'src/config/db';
import { Read } from '../entities';

export class StreakRepository {
  constructor(private readonly database: Pool) {}

  async createRead(
    userId: string,
    postId: string,
    { source, medium, campaign, channel }: { [key: string]: string },
  ): Promise<void> {
    await this.database.query(
      `INSERT INTO reads ("userId","postId","utmSource", "utmMedium","utmCampaign", "utmChannel") 
      VALUES ($1,$2,$3,$4,$5,$6);`,
      [userId, postId, source, medium, campaign, channel],
    );

    return;
  }

  async findReadByPostAndUserId(userId: string, postId: string) {
    const result = await this.database.query(
      `SELECT * FROM "reads" WHERE "userId" = $1 AND "postId" = $2;`,
      [userId, postId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new Read(
      row.id,
      row.userId,
      row.postId,
      row.utmSource,
      row.utmMedium,
      row.utmCampaign,
      row.utmChannel,
      row.createdAt,
      row.updatedAt,
    );
  }
}

export const makeStreakRepository = () => {
  const dbPool = db;

  return new StreakRepository(dbPool);
};
