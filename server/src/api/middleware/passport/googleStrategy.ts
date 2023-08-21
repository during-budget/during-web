import { Request } from "express";
import passport from "passport";
import { Strategy as GogoleStrategy, Profile } from "passport-google-oauth20";
import * as UserService from "src/services/user";
import {
  CONNECTED_ALREADY,
  EMAIL_IN_USE,
  SNSID_IN_USE,
  USER_NOT_FOUND,
} from "src/api/message";
import { ProfileParser } from "./profileParser";

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
                const err = new Error(EMAIL_IN_USE);
                return done(err, null, null);
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

          if (UserService.checkSnsIdActive(user, sns)) {
            const err = new Error(CONNECTED_ALREADY);
            return done(err, null, null);
          }

          const { user: exUser } = await UserService.findBySnsId(
            sns,
            profile.id
          );
          if (exUser) {
            const err = new Error(SNSID_IN_USE);
            return done(err, null, null);
          }

          await UserService.updateSnsId(user, sns, profile.id);
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
          const { user } = await UserService.findAdmin(profile.id);
          if (user) {
            return done(null, user);
          }

          /* register(blocked) */
          const err = new Error(USER_NOT_FOUND);
          return done(err, null);
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};

export { google, googleAdmin };
