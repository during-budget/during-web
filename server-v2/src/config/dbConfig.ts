import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  mongoDB: {
    DB_URL: process.env.DB_URL,
  },
}));
