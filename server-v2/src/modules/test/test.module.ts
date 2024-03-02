import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [TestController],
  providers: [TestService],
  exports: [],
})
export class TestModule {}
