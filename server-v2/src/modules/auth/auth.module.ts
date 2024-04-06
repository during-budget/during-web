import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { LocalSerializer } from './local.serializer';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule.register({ session: true }), UserModule],
  providers: [AuthService, LocalStrategy, LocalSerializer],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
