import { registerAs } from '@nestjs/config';

export default registerAs('test', () => ({
  key: process.env.KEY,
}));
