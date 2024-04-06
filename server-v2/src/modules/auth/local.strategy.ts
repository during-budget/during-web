import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'custom') {
  static key = 'custom';

  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    if (!('body' in req)) {
      throw new Error();
    }

    if (!('_id' in req.body)) {
      throw new Error();
    }

    const user = await this.authService.validateUserById(req.body._id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
