import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from '@controller/user.controller';
import { User, UserSchema } from '@schema/user.schema';
import { UserService } from '@service/user.service';
import { UserEntityService } from '@service/user.entity.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserEntityService],
  exports: [UserEntityService],
})
class UserEntityModule {}

@Module({
  imports: [UserEntityModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
