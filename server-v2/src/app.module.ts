import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestController } from '@controller/test.controller';
import { TestService } from '@service/test.service';
import { validationSchema } from '@config/validationSchema';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: config,
    }),
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class AppModule {}
