import { Request, Response } from "express";
import _ from "lodash";

import { NextFunction } from "express-serve-static-core";

import passport from "passport";

import {
  CONNECT_SUCCESS,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  FIELD_INVALID,
  EMAIL_UPDATE_SUCCESS,
  LOGIN_VERIFICATION_CODE_SENT,
  REGISTER_VERIFICATION_CODE_SENT,
  EMAIL_UPDATE_VERIFICATION_CODE_SENT,
} from "../message";

import * as UserService from "src/services/users";
import { SnsIdNotFoundError } from "src/errors/NotFoundError";
import { AtLeastOneSnsIdIsRequiredError } from "src/errors/ConfilicError";
import { FieldInvalidError } from "src/errors/InvalidError";
const AuthService = UserService.AuthService;

const clientRedirectURL = process.env.CLIENT.trim() + "/redirect/auth";

const clientAdminURL = process.env.CLIENT_ADMIN.trim();

export const find = async (req: Request, res: Response) => {
  const user = req.user!;

  return res.status(200).send({
    email: user.email,
    isLocal: user.isLocal,
    snsId: user.snsId ?? {},
    isGuest: user.isGuest,
  });
};

export const callbackAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "googleAdmin",
    async (authError: Error, user: Express.User) => {
      try {
        if (authError) throw authError;
        return req.login(user, (loginError) => {
          if (loginError) throw loginError;
          return res.redirect(clientAdminURL + "/login/redirect");
        });
      } catch (err: any) {
        return res.redirect(
          clientAdminURL + "?error=" + encodeURIComponent(err.message)
        );
      }
    }
  )(req, res, next);
};

export const callback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const provider = req.params.provider;
  if (provider !== "google" && provider !== "naver" && provider !== "kakao") {
    return res.redirect(
      clientRedirectURL +
        "?message=" +
        encodeURIComponent(FIELD_INVALID("provider"))
    );
  }

  passport.authenticate(
    provider,
    async (
      authError: Error,
      user: Express.User,
      type: "login" | "register" | "connect"
    ) => {
      try {
        if (authError) {
          return res.redirect(
            clientRedirectURL +
              `?message=${encodeURIComponent(authError.message)}`
          );
        }

        /* _____ 소셜 로그인 _____ */
        if (type === "login") {
          return req.login(user, (loginError) => {
            if (loginError) {
              throw loginError;
            }
            // 로그인 성공
            req.session.cookie["maxAge"] = 365 * 24 * 60 * 60 * 1000; //1 year
            return res.redirect(
              clientRedirectURL +
                `?message=${encodeURIComponent(LOGIN_SUCCESS)}`
            );
          });
        } else if (type === "register") {
          /* _____ 소셜 회원 가입 _____ */
          return req.login(user, (loginError) => {
            if (loginError) {
              throw loginError;
            }
            // 회원 가입 후 로그인 성공
            req.session.cookie["maxAge"] = 365 * 24 * 60 * 60 * 1000; //1 year
            return res.redirect(
              clientRedirectURL + `?message=${REGISTER_SUCCESS}`
            );
          });
        }
        /* _____ 소셜 계정 연결 _____ */
        // 소셜 계정 연결 성공
        return res.redirect(
          clientRedirectURL + `?message=${encodeURIComponent(CONNECT_SUCCESS)}`
        );
      } catch (err: any) {
        return res.redirect(
          clientRedirectURL + `?message=${encodeURIComponent(err.message)}`
        );
      }
    }
  )(req, res, next);
};

export const local = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "localV2",
    async (
      authError?: Error,
      user?: Express.User,
      type?:
        | "login"
        | "loginVerify"
        | "register"
        | "registerVerify"
        | "updateEmail"
        | "updateEmailVerify"
    ) => {
      try {
        if (authError) throw authError;

        /* _____ 로그인 & 회원가입 & 이메일 변경 _____ */
        if (type === "login") {
          return res
            .status(200)
            .send({ message: LOGIN_VERIFICATION_CODE_SENT });
        }
        if (type === "register") {
          return res
            .status(200)
            .send({ message: REGISTER_VERIFICATION_CODE_SENT });
        }
        if (type === "updateEmail") {
          return res
            .status(200)
            .send({ message: EMAIL_UPDATE_VERIFICATION_CODE_SENT });
        }
        /* _____ 로그인 & 회원가입 검증 _____ */
        if ((type === "loginVerify" || type === "registerVerify") && user) {
          return req.login(user, (loginError) => {
            if (loginError) throw loginError;
            /* set maxAge as 1 year if auto login is requested */
            if (req.body.persist === true) {
              req.session.cookie["maxAge"] = 365 * 24 * 60 * 60 * 1000; //1 year
            }
            return res.status(200).send({
              message:
                type === "loginVerify" ? LOGIN_SUCCESS : REGISTER_SUCCESS,
              user,
            });
          });
        }
        /* _____ 이메일 변경 검증 _____ */
        if (type === "updateEmailVerify" && user) {
          return res.status(200).send({
            message: EMAIL_UPDATE_SUCCESS,
            user: {
              _id: user._id,
              email: user.email,
              isLocal: user.isLocal,
              isGuest: user.isGuest,
            },
          });
        }
      } catch (err: any) {
        next(err);
      }
    }
  )(req, res, next);
};

export const guest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "guestV2",
    async (authError?: Error, user?: Express.User) => {
      try {
        if (authError || !user) throw authError;

        return req.login(user, (loginError) => {
          if (loginError) throw loginError;
          /* set maxAge as 1 year if auto login is requested */
          if (req.body.persist === true) {
            req.session.cookie["maxAge"] = 365 * 24 * 60 * 60 * 1000; //1 year
          }
          return res.status(200).send({
            message: LOGIN_SUCCESS,
            user,
          });
        });
      } catch (err: any) {
        next(err);
      }
    }
  )(req, res, next);
};

export const disconnect = async (req: Request, res: Response) => {
  const provider = req.params.provider;
  const user = req.user!;

  if (provider === "google" || provider === "naver" || provider === "kakao") {
    if (!AuthService.checkSnsIdActive(user, provider))
      throw new SnsIdNotFoundError();
    if (
      !AuthService.isLocalLoginActive(user) &&
      AuthService.countActiveSnsId(user) === 1
    ) {
      throw new AtLeastOneSnsIdIsRequiredError();
    }
    await AuthService.removeSnsId(user, provider);
  } else if (provider === "local") {
    if (!AuthService.hasActiveSnsId(user)) {
      throw new AtLeastOneSnsIdIsRequiredError();
    }

    await AuthService.disableLocalLogin(user);
  } else {
    throw new FieldInvalidError(provider);
  }

  return res.status(200).send({
    email: user.email,
    isLocal: user.isLocal,
    snsId: user.snsId ?? {},
    isGuest: user.isGuest,
  });
};

export const logout = async (req: Request, res: Response) => {
  const user = req.user!;

  req.logout(async (err: Error) => {
    try {
      if (err) throw err;
      req.session.destroy(() => {});
      res.clearCookie("connect.sid");
      if (AuthService.isGuest(user)) {
        await UserService.remove(user);
      }
      return res.status(200).send({});
    } catch (err: any) {
      return res.status(err.status || 500).send({ message: err.message });
    }
  });
};
