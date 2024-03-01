import { registerAs } from '@nestjs/config';

export const PortoneConfig = registerAs('Portone', () => ({
  imp: {
    key: process.env.PORTONE_IMP_KEY,
    secret: process.env.PORTONE_IMP_SECRET,
  },
}));
