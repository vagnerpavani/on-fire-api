import { Pool } from 'pg';
import { db } from 'src/config';
import { Post, Read, User } from '../entities';
import { STREAK_STATUS } from '../constants';

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

  async getAllReadsWithUserAndPost(
    startAt?: string,
    endAt?: string,
    postId?: string,
    streakStatus?: string,
  ) {
    const filters = [];
    if (startAt) filters.push(startAt);
    if (endAt) filters.push(endAt);
    if (postId) filters.push(postId);

    const filterQuery = `SELECT reads.*,
      posts.id AS "postId", 
      posts.title AS "postTitle", 
      posts."publishedAt" AS "postPublishedAt",
      posts."beehivId" AS "postBeehivId",
      users.id AS "userId", 
      users.email AS "userEmail",
      users."recordStreak" AS "userRecordStreak",
      users."currentStreak" AS "userCurrentStreak"
      FROM reads
      JOIN users ON reads."userId" = users.id
      JOIN posts ON reads."postId" = posts.id
      ${postId || startAt || endAt ? 'WHERE' : ''}
      ${postId ? `reads."postId" = $${filters.length}` : ''}
      ${(postId && startAt) || (postId && endAt) ? 'AND' : ''}
      ${startAt && !endAt ? `reads."createdAt" >= $1` : ''}
      ${!startAt && endAt ? `reads."createdAt" <= $1` : ''}
      ${startAt && endAt ? 'reads."createdAt" BETWEEN $1 AND $2' : ''}
      ORDER BY posts.id, users.id;`;

    const result = await this.database.query(filterQuery, filters);

    const postsMap = new Map<string, Partial<Post>>();

    result.rows.forEach((row) => {
      if (!postsMap.has(row.postId)) {
        postsMap.set(row.postId, {
          id: row.postId,
          title: row.postTitle,
          publishedAt: row.postPublishedAt,
          beehivId: row.postBeehivId,
          users: [],
          reads: [],
        });
      }

      const post = postsMap.get(row.postId)!;

      if (row.id && !post.reads.some((read) => read.id === row.id)) {
        post.reads.push({
          id: row.id,
          userId: row.userId,
          postId: row.postId,
          utmSource: row.utmSource,
          utmMedium: row.utmMedium,
          utmCampaign: row.utmCampaign,
          utmChannel: row.utmChannel,
          createdAt: row.created_at,
          updatedAt: row.updatedAt,
        });
      }

      if (row.userId && !post.users.some((user) => user.id === row.userId)) {
        if (streakStatus === STREAK_STATUS.STREAK && row.userCurrentStreak <= 1)
          return;
        if (
          streakStatus === STREAK_STATUS.NO_STREAK &&
          row.userCurrentStreak >= 1
        )
          return;

        post.users.push({
          id: row.userId,
          email: row.userEmail,
          currentStreak: row.userCurrentStreak,
          recordStreak: row.userRecordStreak,
        });
      }
    });

    return Array.from(postsMap.values());
  }

  async resetStreak(postId: string) {
    const result = await this.database.query(
      `
      UPDATE users 
      SET "updatedAt" = NOW(),
      "currentStreak" = 0
      WHERE NOT EXISTS (
      SELECT 1 
      FROM reads 
      WHERE reads."userId" = users."id" 
      AND reads."postId" = $1
    );`,
      [postId],
    );
  }
}

export const makeStreakRepository = () => {
  const dbPool = db;

  return new StreakRepository(dbPool);
};
