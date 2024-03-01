import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '@config/validationSchema';
import config from './config';
import { DatabaseConfig } from './config/DatabaseConfig';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigType } from '@nestjs/config';
import { UserModule } from './module/user.module';
import { TestModule } from './module/test.module';

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
    UserModule,
    TestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
