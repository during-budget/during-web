import { Request } from "express";

import passport from "passport";
import { Strategy as CustomStrategy } from "passport-custom";

import { User } from "../models/User";

import { client } from "../_redis";
import { cipher, decipher } from "../utils/crypto";
import { generateRandomNumber } from "../utils/randomString";
import {
  LOCAL_LOGIN_DISABLED,
  VERIFICATION_CODE_EXPIRED,
  VERIFICATION_CODE_WRONG,
} from "../@message";
import { FIELD_REQUIRED } from "../@message";
import { sendEmail } from "../utils/email";
import { CONNECTED_ALREADY } from "../@message";
import { EMAIL_IN_USE } from "../@message";

const localV2 = () => {
  passport.use(
    "localV2",
    new CustomStrategy(async function (req: Request, done: any) {
      try {
        if (!("email" in req.body)) {
          const err = new Error(FIELD_REQUIRED("email"));
          return done(err, null, null);
        }
        /* isNotLoggedIn - login or register */
        if (!req.isAuthenticated()) {
          const user = await User.findOne({
            email: req.body.email,
          });

          /* login */
          if (user) {
            if (!user.isLocal) {
              const err = new Error(LOCAL_LOGIN_DISABLED);
              return done(err, null, null);
            }

            /* login - send code */
            if (!("code" in req.body)) {
              const code = generateRandomNumber(6);
              sendEmail({
                to: req.body.email,
                subject: "로그인 인증 메일입니다.",
                html: `로그인 확인 코드는 [ ${code} ]입니다. <br/>
              코드는 5분간 유효합니다.`,
              });
              await Promise.all([
                client.v4.hSet(req.body.email, "code", cipher(code)),
                client.expire(req.body.email, 60 * 5),
              ]);
              return done(null, user, "login");
            }

            /* login - verify code */
            const _code = await client.v4.hGet(user.email, "code");
            if (!_code) {
              const err = new Error(VERIFICATION_CODE_EXPIRED);
              return done(err, null, null);
            }

            if (decipher(_code) !== req.body.code) {
              const err = new Error(VERIFICATION_CODE_WRONG);
              return done(err, null, null);
            }
            await client.del(user.email ?? "");

            return done(null, user, "loginVerify");
          }

          /* register - send code */
          if (!("code" in req.body)) {
            const code = generateRandomNumber(6);
            sendEmail({
              to: req.body.email,
              subject: "가입 인증 메일입니다.",
              html: `가입 확인 코드는 [ ${code} ]입니다. <br/>
              코드는 5분간 유효합니다.`,
            });
            await Promise.all([
              client.v4.hSet(req.body.email, "code", cipher(code)),
              client.expire(req.body.email, 60 * 5),
            ]);
            return done(null, null, "register");
          }

          /* register  - verify code */
          const _code = await client.v4.hGet(req.body.email, "code");
          if (!_code) {
            const err = new Error(VERIFICATION_CODE_EXPIRED);
            return done(err, null, null);
          }

          if (decipher(_code) !== req.body.code) {
            const err = new Error(VERIFICATION_CODE_WRONG);
            return done(err, null, null);
          }
          await client.del(req.body.email ?? "");

          const newUser = new User({
            email: req.body.email,
            isLocal: true,
          });
          await newUser.initialize();

          return done(null, newUser, "registerVerify");
        }

        /* isLoggedIn - updateEmail */
        const user = req.user!;

        if (user.email === req.body.email) {
          const err = new Error(CONNECTED_ALREADY);
          return done(err, null, null);
        }

        const exUser = await User.find({ email: req.body.email });
        if (exUser) {
          const err = new Error(EMAIL_IN_USE);
          return done(err, null, null);
        }

        /* updateEmail - send code */
        if (!("code" in req.body)) {
          const code = generateRandomNumber(6);
          sendEmail({
            to: req.body.email,
            subject: "이메일 확인 메일입니다.",
            html: `가입 확인 코드는 [ ${code} ]입니다. <br/>
      코드는 5분간 유효합니다.`,
          });
          await Promise.all([
            client.v4.hSet(req.body.email, "code", cipher(code)),
            client.expire(req.body.email, 60 * 5),
          ]);
          return done(null, user, "updateEmail");
        }

        /* updateEmail  - verify code */
        const _code = await client.v4.hGet(req.body.email, "code");
        if (!_code) {
          const err = new Error(VERIFICATION_CODE_EXPIRED);
          return done(err, null, null);
        }

        if (decipher(_code) !== req.body.code) {
          const err = new Error(VERIFICATION_CODE_WRONG);
          return done(err, null, null);
        }
        await client.del(req.body.email ?? "");

        user.email = req.body.email;
        user.isLocal = true;
        if (user.isGuest) {
          user.isGuest = false;
        }
        await user.saveReqUser();

        return done(null, user, "updateEmailVerify");
      } catch (err) {
        return done(err, null);
      }
    })
  );
};

export { localV2 };
