import { Module } from '@nestjs/common';
import { TestController } from '@controller/test.controller';
import { TestService } from '@service/test.service';

@Module({
  imports: [],
  controllers: [TestController],
  providers: [TestService],
})
export class AppModule {}
