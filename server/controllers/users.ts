import { Request, Response, NextFunction } from "express";
import _ from "lodash";
import { User, IUser, IUserProps } from "../models/User";
import { Budget } from "../models/Budget";
import { Transaction } from "../models/Transaction";
import passport from "passport";
import { HydratedDocument } from "mongoose";
import {
  generateRandomString,
  generateRandomNumber,
} from "../utils/randomString";
import { client } from "../redis";
import { sendEmail } from "../utils/email";
import { cipher, decipher } from "../utils/crypto";

//_____________________________________________________________________________

/**
 * Register
 *
 * @body {email}
 */
export const register = async (req: Request, res: Response) => {
  try {
    const exUser = await User.findOne({ email: req.body.email });
    if (exUser)
      return res
        .status(409)
        .send({ message: `email ${req.body.email} is already in use` });

    // email 유효성 검사

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
    return res.status(200).send({});
  } catch (err: any) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Verify
 *
 * @body {email, code}
 */
export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!("email" in req.body) || !("code" in req.body))
    return res.status(400).send({ message: "required field is missing" });

  passport.authenticate(
    "register",
    (authError: Error, user: HydratedDocument<IUser, IUserProps>) => {
      try {
        if (authError) throw authError;
        return req.login(user, (loginError) => {
          if (loginError) throw loginError;
          /* set maxAge as 1 year if auto login is requested */
          if (req.body.persist === "true") {
            req.session.cookie["maxAge"] = 365 * 24 * 60 * 60 * 1000; //1 year
          }
          return res.status(200).send({ user });
        });
      } catch (err: any) {
        return res.status(err.status || 500).send({ message: err.message });
      }
    }
  )(req, res, next);
};

/**
 * Login (guest)
 *
 */
export const loginGuest = async (req: Request, res: Response) => {
  try {
    let email = generateRandomString(8);
    while (true) {
      const exUser = await User.findOne({ email });
      if (exUser) email = generateRandomString(8);
      else break;
    }
    const password = generateRandomString(16);

    const user = new User({
      email,
      password,
      isGuest: true,
    });
    await user.save();

    req.body.email = user.email;
    req.body.password = password;
    passport.authenticate(
      "local",
      (authError: Error, user: HydratedDocument<IUser, IUserProps>) => {
        try {
          if (authError) throw authError;
          return req.login(user, (loginError: Error) => {
            if (loginError) throw loginError;
            return res.status(200).send({ user });
          });
        } catch (err: any) {
          throw err;
        }
      }
    )(req, res);
  } catch (err: any) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Login (local)
 *
 * @body {email: 'user00001'}
 */
export const loginLocal = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send({});

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
  return res.status(200).send({});
};

/**
 * Login Verification (local)
 *
 * @body {email: 'user00001', code: '123123'}
 */
export const loginVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!("email" in req.body))
    return res.status(400).send({ message: "field(email) is required" });
  if (!("code" in req.body))
    return res.status(400).send({ message: "field(code) is required" });

  passport.authenticate(
    "local",
    (authError: Error, user: HydratedDocument<IUser, IUserProps>) => {
      try {
        if (authError) throw authError;
        console.log("DEBUG: authentication is over");
        return req.login(user, (loginError) => {
          if (loginError) throw loginError;
          console.log("DEBUG: login is over");
          /* set maxAge as 1 year if auto login is requested */
          if (req.body.persist === "true") {
            req.session.cookie["maxAge"] = 365 * 24 * 60 * 60 * 1000; //1 year
          }
          console.log("DEBUG: sending response");
          return res.status(200).send({ user });
        });
      } catch (err: any) {
        return res.status(err.status || 500).send({ message: err.message });
      }
    }
  )(req, res, next);
};

/**
 * Logout
 */
export const logout = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const isGuest = req.user?.isGuest;

  req.logout(async (err: Error) => {
    try {
      if (err) throw err;
      req.session.destroy(() => {});
      res.clearCookie("connect.sid");
      if (isGuest) {
        await Promise.all([
          User.findByIdAndDelete(userId),
          Budget.deleteMany({ userId }),
          Transaction.deleteMany({ userId }),
        ]);
      }
      return res.status(200).send({});
    } catch (err: any) {
      return res.status(err.status || 500).send({ message: err.message });
    }
  });
};

/**
 * Update fields(birthdate, gender, tel)
 */
export const updateFields = async (req: Request, res: Response) => {
  const user = req.user!;
  user.birthdate = req.body.birthdate;
  user.gender = req.body.gender;
  user.tel = req.body.tel;
  await user.saveReqUser();

  let message = undefined;
  const undefinedFields = [];
  if (!user.birthdate) undefinedFields.push("birthdate");
  if (!user.gender) undefinedFields.push("gender");
  if (!user.tel) undefinedFields.push("tel");
  if (undefinedFields.length !== 0) {
    message = `field(${_.join(undefinedFields, ", ")}) is undefined`;
  }

  return res.status(200).send({
    birthdate: req.user?.birthdate,
    gender: req.user?.gender,
    tel: req.user?.tel,
    message,
  });
};

/**
 * Read current user's info
 */
export const current = (req: Request, res: Response) => {
  return res.status(200).send({ user: req.user });
};

/**
 * Read all users (master)
 */
export const list = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(200).send({ users });
  } catch (err: any) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};
