import { registerAs } from '@nestjs/config';

export const DatabaseConfig = registerAs('Database', () => ({
  mongoDB: {
    DB_URL: process.env.DB_URL,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    userName: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  },
}));
