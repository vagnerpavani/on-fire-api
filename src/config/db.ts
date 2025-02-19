import { Pool } from 'pg';
import { loadEnv } from './env';

loadEnv();

const configDatabase = {
  connectionString: process.env.DATABASE_URL,
};

export const db = new Pool(configDatabase);
