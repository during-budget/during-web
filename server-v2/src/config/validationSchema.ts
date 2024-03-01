import * as Joi from 'joi';

enum Environment {
  Develop = 'develop',
  Proudction = 'production',
}

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid(...Object.values(Environment)),

  SERVER_PORT: Joi.number().required(),
  CLIENT: Joi.string().required(),
  CLIENT_ADMIN: Joi.string().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  NAVER_CLIENT_ID: Joi.string().required(),
  NAVER_CLIENT_SECRET: Joi.string().required(),
  KAKAO_CLIENT_ID: Joi.string().required(),

  DB_URL: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_USERNAME: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().required(),

  CRYPTO_KEY: Joi.string().required(),
  CRYPTO_SALT: Joi.string().required(),
  CRYPTO_ALGORITHM: Joi.string().required(),

  SALT_ROUNDS: Joi.number().required(),
  SESSION_KEY: Joi.string().required(),

  NODEMAILER_USER: Joi.string().required(),
  NODEMAILER_PASS: Joi.string().required(),

  PORTONE_IMP_KEY: Joi.string().required(),
  PORTONE_IMP_SECRET: Joi.string().required(),
});
