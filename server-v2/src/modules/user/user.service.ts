import { Injectable } from '@nestjs/common';
import { User } from './user.schema';
import { UserEntityService } from './user.entity.service';

@Injectable()
export class UserService {
  constructor(readonly model: UserEntityService) {}

  async createUser(req: { userName: string }): Promise<User> {
    const user = await this.model.create({ userName: req.userName });

    return user;
  }

  async findAll(): Promise<Array<User>> {
    return this.model.find();
  }
}
