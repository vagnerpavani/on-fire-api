import * as dotenv from 'dotenv';
import { expand as dotEnvExpand } from 'dotenv-expand';
import { resolve } from 'path';

export function loadEnv(): void {
  const dotEnvConfig =
    process.env.NODE_ENV !== 'production'
      ? dotenv.config({
          path: resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
        })
      : dotenv.config();

  dotEnvExpand(dotEnvConfig);
}
