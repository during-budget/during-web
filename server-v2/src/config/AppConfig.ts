import { registerAs } from '@nestjs/config';

export const AppConfig = registerAs('App', () => ({
  serverPort: process.env.SERVER_PORT,
  clientUrl: process.env.CLIENT,
  adminClientUrl: process.env.CLIENT_ADMIN,
  session: {
    secret: process.env.SESSION_KEY,
  },
}));
