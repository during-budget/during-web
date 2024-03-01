import { registerAs } from '@nestjs/config';

export const NodemailerConfig = registerAs('Nodmailer', () => ({
  user: process.env.NODEMAILER_USER,
  password: process.env.NODEMAILER_PASS,
}));
