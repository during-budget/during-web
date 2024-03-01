import { registerAs } from '@nestjs/config';

export const TestConfig = registerAs('Test', () => ({
  key: process.env.KEY,
}));
