import { Request } from "express";

import passport from "passport";
import { Strategy as CustomStrategy } from "passport-custom";

import * as UserService from "src/services/users";
const AuthService = UserService.AuthService;

import { client } from "src/loaders/redis";
import { cipher, decipher } from "src/utils/crypto";

import { sendAuthEmail } from "src/utils/email";
import {
  EmailIsInUseError,
  EmailRequiredError,
  FailedToSendVerificationCodeError,
  LocalLoginIsDisabledError,
  VerificationCodeIsExpiredError,
  VerificationCodeIsWrongError,
} from "src/errors/AuthError";

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
    throw new FailedToSendVerificationCodeError();
  }
};

const verifyCode = async (email: string, code: string) => {
  const _code = await client.v4.hGet(email, "code");
  if (!_code) throw new VerificationCodeIsExpiredError();

  if (decipher(_code) !== code) throw new VerificationCodeIsWrongError();
  await client.del(email ?? "");
};

const localV2 = () => {
  passport.use(
    "localV2",
    new CustomStrategy(async function (req: Request, done: any) {
      try {
        if (!("email" in req.body)) throw new EmailRequiredError();

        /* isNotLoggedIn - login or register */
        if (!req.isAuthenticated()) {
          const { user } = await UserService.findByEmail(req.body.email);

          /* login */
          if (user) {
            if (!user.isLocal) throw new LocalLoginIsDisabledError();

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
          if (exUser) throw new EmailIsInUseError();
        }

        /* updateEmail - send code */
        if (!("code" in req.body)) {
          await sendCode("updateEmail", req.body.email);
          return done(null, user, "updateEmail");
        }

        /* updateEmail  - verify code */
        await verifyCode(req.body.email, req.body.code);

        await AuthService.updateEmailAndActivateLocalLogin(
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
