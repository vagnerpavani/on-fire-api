import { createApp } from './app';
import { loadEnv } from './config';

async function bootstrap() {
  loadEnv();
  await createApp();
}
bootstrap();
