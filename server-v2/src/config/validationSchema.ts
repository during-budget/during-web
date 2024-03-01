import * as Joi from 'joi';

enum Environment {
  Develop = 'develop',
  Proudction = 'production',
}

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .required(),
  PORT: Joi.number().required(),
  KEY: Joi.number().required(),
  DB_URL: Joi.string().required(),
});
