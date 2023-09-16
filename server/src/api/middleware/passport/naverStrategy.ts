import { Request } from "express";
import passport, { Profile } from "passport";
import { Strategy as NaverStrategy } from "passport-naver";

import * as UserService from "src/services/users";
const AuthService = UserService.AuthService;
import { ProfileParser } from "./profileParser";
import {
  EmailIsInUseError,
  SnsIdIsAlreadyConnectedError,
  SnsIdIsInUseError,
} from "errors/AuthError";

const sns = "naver";
class Parser extends ProfileParser {
  constructor(profile: any) {
    super(profile);
    if (profile.emails && profile.emails.length > 0) {
      this.setEmail(profile.emails[0].value);
    }
  }
}

const naver = (client: { ID: string; SECRET: string; callbackURL: string }) => {
  passport.use(
    "naver",
    new NaverStrategy(
      {
        clientID: client.ID,
        clientSecret: client.SECRET,
        callbackURL: client.callbackURL,
        passReqToCallback: true,
      },
      async (
        req: Request,
        accessToken: string,
        refreshToken: string,
        _profile: Profile,
        done: any
      ) => {
        try {
          const parser = new Parser(_profile);
          const profile = parser.get();

          /* isNotLoggedIn - login or register */
          if (!req.isAuthenticated()) {
            /* login */
            const { user } = await UserService.findBySnsId(sns, profile.id);
            if (user) {
              return done(null, user, "login");
            }

            /* register */
            if (profile.email) {
              const { user: exUser } = await UserService.findByEmail(
                profile.email
              );
              if (exUser) throw new EmailIsInUseError();
            }

            const { user: newUser } = await UserService.createSnsUser(
              sns,
              profile
            );

            return done(null, newUser, "register");
          }
          /* if user is logged in - connect */
          const user = req.user!;

          if (AuthService.checkSnsIdActive(user, sns))
            throw new SnsIdIsAlreadyConnectedError();

          const { user: exUser } = await UserService.findBySnsId(
            sns,
            profile.id
          );
          if (exUser) throw new SnsIdIsInUseError();

          await AuthService.updateSnsId(user, sns, profile.id);
          return done(null, user, "connect");
        } catch (error: any) {
          done(error);
        }
      }
    )
  );
};

export { naver };
