import passport from "passport";
import { google, googleAdmin } from "./googleStrategy";
import { naver } from "./naverStrategy";
import { kakao } from "./kakaoStrategy";
import { localV2 } from "./localV2Strategy";
import { guestV2 } from "./guestV2Strategy";
import { configType } from "src/config/type";
import * as UserService from "src/services/user";

export default (config: configType) => {
  passport.serializeUser((user, done) => {
    done(null, { _id: user._id, isGuest: user?.isGuest });
  });

  passport.deserializeUser(({ _id }, done) => {
    UserService.findById(_id)
      .then((user: Express.User | null) => {
        done(null, user);
      })
      .catch((err) => done(err, null));
  });

  google(config.OAUTH_CLIENT.GOOGLE);
  googleAdmin(config.OAUTH_CLIENT.GOOGLE_ADMIN);

  naver(config.OAUTH_CLIENT.NAVER);
  kakao(config.OAUTH_CLIENT.KAKAO);

  localV2();
  guestV2();
};
