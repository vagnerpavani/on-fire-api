import { db } from 'src/config/db';

export const cleanDatabase = async (): Promise<void> => {
  await db.query(`
    TRUNCATE reads, users, posts RESTART IDENTITY;
    `);
};
