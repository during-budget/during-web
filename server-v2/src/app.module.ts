import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestController } from '@controller/test.controller';
import { TestService } from '@service/test.service';
import testConfig from '@config/testConfig';
import { validationSchema } from '@config/validationSchema';
import dbConfig from '@config/dbConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [testConfig, dbConfig],
    }),
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class AppModule {}
