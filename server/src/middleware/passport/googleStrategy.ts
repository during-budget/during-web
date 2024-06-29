import { Request } from "express";
import passport from "passport";
import { Strategy as GogoleStrategy, Profile } from "passport-google-oauth20";
import * as UserService from "src/services/users";
const AuthService = UserService.AuthService;

import { ProfileParser } from "./profileParser";
import {
  EmailIsInUseError,
  SnsIdIsAlreadyConnectedError,
  SnsIdIsInUseError,
} from "src/errors/AuthError";
import { UserNotFoundError } from "src/errors/NotFoundError";

const sns = "google";
class Parser extends ProfileParser {
  constructor(profile: any) {
    super(profile);
    if (profile.emails) {
      for (let _email of profile.emails) {
        if (_email.verified) {
          this.setEmail(_email.value);
          break;
        }
      }
    }
  }
}

const google = (client: {
  ID: string;
  SECRET: string;
  callbackURL: string;
}) => {
  passport.use(
    sns,
    new GogoleStrategy(
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
              if (exUser) {
                throw new EmailIsInUseError();
              }
            }

            const { user: newUser } = await UserService.createSnsUser(
              sns,
              profile
            );

            return done(null, newUser, "register");
          }
          /* if user is logged in - connect */
          const user = req.user!;

          if (AuthService.checkSnsIdActive(user, sns)) {
            throw new SnsIdIsAlreadyConnectedError();
          }

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

const googleAdmin = (client: {
  ID: string;
  SECRET: string;
  callbackURL: string;
}) => {
  passport.use(
    "googleAdmin",
    new GogoleStrategy(
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
        profile: Profile,
        done: any
      ) => {
        try {
          /* login */
          const { user } = await UserService.findAdminByGoogleId(profile.id);
          if (user) {
            return done(null, user);
          }

          /* register(blocked) */
          throw new UserNotFoundError();
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

export { google, googleAdmin };
