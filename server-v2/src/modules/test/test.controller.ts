import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { TestService } from './test.service';
import { LocalAuthGuard } from '@modules/auth/local.auth.guard';

@Controller()
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get('/test')
  getHello(): string {
    return this.testService.getHello();
  }

  @Get('/test/config')
  getConfig(): object {
    return this.testService.getConfig();
  }

  @Get('/test/users')
  @UseGuards(LocalAuthGuard)
  testUser(@Request() req): any {
    return { User: req.user, msg: 'User logged in' };
  }
}
