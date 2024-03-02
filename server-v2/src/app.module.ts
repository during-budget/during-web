import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '@config/validationSchema';
import config from './config';
import { DatabaseConfig } from '@config/DatabaseConfig';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigType } from '@nestjs/config';
import { Modules } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: config,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (dbConfig: ConfigType<typeof DatabaseConfig>) => ({
        uri: dbConfig.mongoDB.DB_URL,
      }),
      inject: [DatabaseConfig.KEY],
    }),
    ...Object.values(Modules),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
