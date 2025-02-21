import { faker } from '@faker-js/faker/.';
import * as dayjs from 'dayjs';
import { db } from 'src/config/db';
import { Post, Read, User } from 'src/modules/streak/entities';

export const cleanDatabase = async (): Promise<void> => {
  await db.query(`
    TRUNCATE reads, users, posts RESTART IDENTITY;
    `);
};

export const createFakeUser = async (
  overrides: Partial<User> = {},
): Promise<User> => {
  const email = overrides.email ? overrides.email : faker.internet.email();
  const recordStreak = overrides.recordStreak ? overrides.recordStreak : 0;

  const result = await db.query(
    `INSERT INTO users ("email", "recordStreak") 
      VALUES ($1, $2) RETURNING *;`,
    [email, recordStreak],
  );

  const row = result.rows[0];
  return new User(
    row.id,
    row.email,
    row.recordStreak,
    row.createdAt,
    row.updatedAt,
  );
};

export const createFakePost = async (
  overrides: Partial<Post> = {},
): Promise<Post> => {
  const beehivId = overrides.beehivId ? overrides.beehivId : 'post_00-00-00';
  const title = overrides.title ? overrides.title : faker.lorem.sentence(3);
  const publishedAt = overrides.publishedAt
    ? overrides.publishedAt
    : dayjs().format();

  const result = await db.query(
    `INSERT INTO posts ("beehivId", title, "publishedAt") VALUES ($1,$2,$3) RETURNING *;`,
    [beehivId, title, publishedAt],
  );

  const row = result.rows[0];
  return new Post(
    row.id,
    row.title,
    row.publishedAt,
    row.beehivId,
    row.createdAt,
    row.updatedAt,
  );
};

export const createFakeRead = async (
  overrides: { user?: User; post?: Post } = {},
) => {
  const user = overrides.user ? overrides.user : await createFakeUser();
  const post = overrides.post ? overrides.post : await createFakePost();
  const utmInfo = {
    utmSource: faker.word.noun(),
    utmMedium: faker.word.noun(),
    utmCampaign: faker.word.noun(),
    utmChannel: faker.word.noun(),
  };

  const result = await db.query(
    `INSERT INTO reads ("userId","postId","utmSource", "utmMedium","utmCampaign", "utmChannel") 
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;`,
    [
      user.id,
      post.id,
      utmInfo.utmSource,
      utmInfo.utmMedium,
      utmInfo.utmCampaign,
      utmInfo.utmChannel,
    ],
  );

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
};
