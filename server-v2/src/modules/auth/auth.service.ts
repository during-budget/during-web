import { User } from '@modules/user/user.schema';
import { UserService } from '@modules/user/user.service';
import { Injectable, NotAcceptableException } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUserById(_id: string): Promise<User> {
    const user = await this.userService.model.findById(_id);

    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }

    return user;
  }
}
