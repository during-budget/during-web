import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users')
  findAll() {
    return this.userService.findAll();
  }

  @Post('/users')
  create() {
    return this.userService.createUser({ userName: new Date().toString() });
  }
}
