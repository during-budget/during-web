import { INestApplication } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as session from 'express-session';

import { Redis } from 'ioredis';
import * as passport from 'passport';
import { DatabaseConfig } from '@config/DatabaseConfig';
import { AppConfig } from '@config/appConfig';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const RedisStore = require('connect-redis').default;

export function setUpSession(app: INestApplication): void {
  const { session: sessionConfig } = app.get<ConfigType<typeof AppConfig>>(
    AppConfig.KEY,
  );

  const { redis: redisConfig } = app.get<ConfigType<typeof DatabaseConfig>>(
    DatabaseConfig.KEY,
  );

  const client = new Redis({
    host: redisConfig.host,
    port: redisConfig.port,
    username: redisConfig.userName,
    password: redisConfig.password,
  });

  // TODO: 설정값 확인 필요
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: sessionConfig.secret,
      cookie: {
        httpOnly: true,
        secure: false,
      },
      rolling: true,
      store: new RedisStore({
        client,
        ttl: 24 * 60 * 60, //1 day
      }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
}
