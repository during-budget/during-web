import { HydratedDocument } from "mongoose";
import passport from "passport";
import { google, googleAdmin } from "./googleStrategy";
import { naver } from "./naverStrategy";
import { kakao } from "./kakaoStrategy";
import { localV2 } from "./localV2Strategy";
import { guestV2 } from "./guestV2Strategy";
import { User, IUser, IUserProps } from "@models/User";
import { configType } from "src/config/type";

export default (config: configType) => {
  passport.serializeUser((user, done) => {
    done(null, { _id: user._id, isGuest: user?.isGuest });
  });

  passport.deserializeUser(({ _id }, done) => {
    User.findById(
      _id,
      (err: any, user: HydratedDocument<IUser, IUserProps>) => {
        if (err) done(err);
        done(null, user);
      }
    );
  });

  google(config.OAUTH_CLIENT.GOOGLE);
  googleAdmin(config.OAUTH_CLIENT.GOOGLE_ADMIN);

  naver(config.OAUTH_CLIENT.NAVER);
  kakao(config.OAUTH_CLIENT.KAKAO);

  localV2();
  guestV2();
};
