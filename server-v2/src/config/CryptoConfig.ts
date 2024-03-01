import { registerAs } from '@nestjs/config';

export const CryptoConfig = registerAs('Crypto', () => ({
  key: process.env.CRYPTO_KEY,
  salt: process.env.CRYPTO_SALT,
  algorithm: process.env.CRYPTO_ALGORITHM,
}));
