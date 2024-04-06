import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { DoneCallback } from 'passport';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: any, done: DoneCallback) {
    console.log('DEBUG', 'serializeUser', { user });
    done(null, { _id: user._id });
  }

  async deserializeUser(payload: any, done: DoneCallback) {
    console.log('DEBUG', 'deserializeUser', { payload });
    return await this.authService
      .validateUserById(payload._id)
      .then((user) => {
        console.log('DEBUG', 'deserializeUser', { user });
        done(null, user);
      })
      .catch((err) => done(err));
  }
}
