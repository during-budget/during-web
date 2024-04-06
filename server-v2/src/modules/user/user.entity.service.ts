import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserEntityService {
  constructor(
    @InjectModel(User.name)
    private readonly entity: Model<UserDocument>,
  ) {}

  async create(req: { userName: string }): Promise<User> {
    const user = await this.entity.create({ userName: req.userName });

    return user;
  }

  async find(): Promise<Array<User>> {
    return this.entity.find();
  }

  async findById(_id: string): Promise<User> {
    return this.entity.findById(new Types.ObjectId(_id));
  }
}
