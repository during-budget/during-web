import { Request } from "express";

import passport from "passport";
import { Strategy as CustomStrategy } from "passport-custom";

import * as UserService from "src/services/user";

import { client } from "src/loaders/redis";
import { cipher, decipher } from "src/utils/crypto";

import {
  LOCAL_LOGIN_DISABLED,
  VERIFICATION_CODE_EXPIRED,
  VERIFICATION_CODE_WRONG,
  FIELD_REQUIRED,
  EMAIL_IN_USE,
  INVALID_EMAIL,
} from "src/api/message";
import { sendAuthEmail } from "src/utils/email";

const sendCode = async (
  type: "login" | "register" | "updateEmail",
  email: string
) => {
  try {
    const code = await sendAuthEmail({
      email,
      type,
    });
    await client.v4.hSet(email, "code", cipher(code));
    await client.expire(email, 60 * 5);
  } catch (err) {
    console.log(err);

    throw new Error(INVALID_EMAIL);
  }
};

const verifyCode = async (email: string, code: string) => {
  const _code = await client.v4.hGet(email, "code");
  if (!_code) {
    throw new Error(VERIFICATION_CODE_EXPIRED);
  }

  if (decipher(_code) !== code) {
    throw new Error(VERIFICATION_CODE_WRONG);
  }

  await client.del(email ?? "");
};

const localV2 = () => {
  passport.use(
    "localV2",
    new CustomStrategy(async function (req: Request, done: any) {
      try {
        if (!("email" in req.body)) {
          throw new Error(FIELD_REQUIRED("email"));
        }
        /* isNotLoggedIn - login or register */
        if (!req.isAuthenticated()) {
          const { user } = await UserService.findByEmail(req.body.email);

          /* login */
          if (user) {
            if (!user.isLocal) {
              throw new Error(LOCAL_LOGIN_DISABLED);
            }

            /* login - send code */
            if (!("code" in req.body)) {
              await sendCode("login", req.body.email);
              return done(null, user, "login");
            }

            /* login - verify code */
            await verifyCode(req.body.email, req.body.code);
            return done(null, user, "loginVerify");
          }

          /* register - send code */
          if (!("code" in req.body)) {
            await sendCode("register", req.body.email);
            return done(null, null, "register");
          }

          /* register  - verify code */
          await verifyCode(req.body.email, req.body.code);

          const { user: newUser } = await UserService.createLocalUser(
            req.body.email
          );

          return done(null, newUser, "registerVerify");
        }

        /* isLoggedIn - updateEmail */
        const user = req.user!;

        if (user.email !== req.body.email) {
          const { user: exUser } = await UserService.findByEmail(
            req.body.email
          );
          if (exUser) {
            throw new Error(EMAIL_IN_USE);
          }
        }

        /* updateEmail - send code */
        if (!("code" in req.body)) {
          await sendCode("updateEmail", req.body.email);
          return done(null, user, "updateEmail");
        }

        /* updateEmail  - verify code */
        await verifyCode(req.body.email, req.body.code);

        await UserService.updateEmailAndActivateLocalLogin(
          user,
          req.body.email
        );

        return done(null, user, "updateEmailVerify");
      } catch (err) {
        return done(err, null);
      }
    })
  );
};

export { localV2 };
