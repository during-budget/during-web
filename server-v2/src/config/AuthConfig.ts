import { registerAs } from '@nestjs/config';

export const AuthConfig = registerAs('Auth', () => ({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  naver: {
    clientId: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
  },
  kakao: {
    clientId: process.env.KAKAO_CLIENT_ID,
  },
}));
