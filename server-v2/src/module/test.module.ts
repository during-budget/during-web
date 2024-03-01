import { Module } from '@nestjs/common';
import { TestController } from '@controller/test.controller';
import { TestService } from '@service/test.service';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule],
  controllers: [TestController],
  providers: [TestService],
  exports: [],
})
export class TestModule {}
