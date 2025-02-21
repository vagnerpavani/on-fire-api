import { Pool } from 'pg';
import { db } from 'src/config';
import { Read, User } from '../entities';

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
  async getReadsFromUserOrderByCreationDesc(
    userId: string,
  ): Promise<{ user: User; reads: Read[] }> {
    const result = await this.database.query(
      `SELECT reads.*, users.id AS "userId_PK", 
      users."createdAt" AS "userCreatedAt",
      users."updatedAt" AS "userUpdatedAt",
      users."recordStreak",
      users.email
      FROM reads JOIN users ON reads."userId" = $1
      ORDER BY reads."createdAt" DESC;`,
      [userId],
    );

    console.log(result.rows);

    if (result.rows.length === 0) {
      return null;
    }

    const user = new User(
      result.rows[0].userId_PK,
      result.rows[0].email,
      result.rows[0].recordStreak,
      result.rows[0].userCreatedAt,
      result.rows[0].userUpdatedAt,
    );

    const reads = result.rows.map((row) => {
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
    });

    return { user, reads };
  }
}

export const makeStreakRepository = () => {
  const dbPool = db;

  return new StreakRepository(dbPool);
};
