import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async logIn(@Request() req) {
    return req.user;
  }

  @Get('current')
  async current(@Request() req) {
    return req.user;
  }
}
