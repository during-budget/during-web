import passport from "passport";
import { Strategy as KakaoStrategy, Profile } from "passport-kakao";
import { Request } from "express";
import { CONNECTED_ALREADY, EMAIL_IN_USE, SNSID_IN_USE } from "src/api/message";
import * as UserService from "src/services/user";
import { ProfileParser } from "./profileParser";

const sns = "kakao";
class Parser extends ProfileParser {
  constructor(profile: any) {
    super(profile);
    this.setEmail(profile._json.kakao_account?.email);
  }
}

const kakao = (client: { ID: string; callbackURL: string }) => {
  passport.use(
    sns,
    new KakaoStrategy(
      {
        clientID: client.ID,
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

export { kakao };
