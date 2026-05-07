import { EnvSchema } from '@iprep/shared';
import 'dotenv/config';

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = Object.freeze(parsed.data);
export type Env = typeof env;
