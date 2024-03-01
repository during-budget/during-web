import { registerAs } from '@nestjs/config';

export const DatabaseConfig = registerAs('Database', () => ({
  mongoDB: {
    DB_URL: process.env.DB_URL,
  },
  redis: {
    DB_URL: process.env.REDIS_URL,
  },
}));
