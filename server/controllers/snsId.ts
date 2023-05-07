import { Request, Response } from "express";
import _ from "lodash";

import { logger } from "../log/logger";
import { getPayload } from "../utils/payload";
import { User } from "../models/User";
import { NextFunction } from "express-serve-static-core";

import passport from "passport";

// const redirectUrl = process.env.CLIENT?.trim() ?? "/";
const redirectUrl = process.env.CLIENT_ADMIN?.trim() ?? "/";

export const find = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    return res.status(200).send({
      snsId: user.snsId ?? {},
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const connectGoogle = async (req: Request, res: Response) => {
  try {
    if (!("credential" in req.body)) {
      return res
        .status(400)
        .send({ message: "req.body.credential is required" });
    }

    const user = req.user!;
    if (user.snsId?.google) {
      return res.status(409).send({ mesage: "already connected" });
    }

    const payload = await getPayload(req.body.credential);
    if (!payload) {
      return res.status(409).send({ message: "payload error" });
    }

    const exUser1 = await User.findOne({
      "snsId.google.id": payload.sub,
    }).lean();
    if (exUser1) {
      return res.status(409).send({ message: "snsId in use" });
    }

    const exUser2 = await User.findOne({
      email: payload.email,
      _id: { $ne: user._id },
    }).lean();
    if (exUser2) {
      return res.status(409).send({ message: "email in use" });
    }

    user.snsId = {
      ...user.snsId,
      google: {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      },
    };
    await user.saveReqUser();

    return res.status(200).send({
      snsId: user.snsId ?? {},
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const disconnectGoogle = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    if (!user.snsId?.google) {
      return res.status(409).send({ message: "not connected" });
    }

    user.snsId = { ...user.snsId, google: undefined };
    await user.saveReqUser();

    return res.status(200).send({
      snsId: user.snsId ?? {},
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const connectNaver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "naverConnect",
    async (
      authError: Error,
      profile: {
        id: string;
        email: string;
        nickname: string;
        profileImage: string;
      }
    ) => {
      try {
        if (authError) throw authError;

        const user = req.user!;
        if (user.snsId?.naver) {
          return res.redirect(
            redirectUrl + "?error=" + encodeURIComponent("already connected")
          );
        }

        const exUser1 = await User.findOne({ "snsId.naver.id": profile.id });
        if (exUser1) {
          return res.redirect(
            redirectUrl + "?error=" + encodeURIComponent("snsId in use")
          );
        }

        const exUser2 = await User.findOne({
          email: profile.email,
          _id: { $ne: user._id },
        });
        if (exUser2) {
          return res.redirect(
            redirectUrl + "?error=" + encodeURIComponent("email in use")
          );
        }

        user.snsId = {
          ...user.snsId,
          naver: {
            id: profile.id,
            email: profile.email,
            name: profile.nickname,
            picture: profile.profileImage,
          },
        };
        await user.saveReqUser();

        return res.redirect(redirectUrl);
      } catch (err: any) {
        return res.redirect(
          redirectUrl + "?error=" + encodeURIComponent("unknown error occured")
        );
      }
    }
  )(req, res, next);
};

export const disconnectNaver = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    if (!user.snsId?.naver) {
      return res.status(409).send({ message: "not connected" });
    }

    user.snsId = { ...user.snsId, naver: undefined };
    await user.saveReqUser();

    return res.status(200).send({
      snsId: user.snsId ?? {},
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const connectKakao = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "kakaoConnect",
    async (
      authError: Error,
      profile: {
        id: string;
        _json?: {
          kakao_account_email: string;
        };
        displayName: string;
        nickname: string;
        profileImage: string;
      }
    ) => {
      try {
        if (authError) throw authError;

        const user = req.user!;
        if (user.snsId?.kakao) {
          return res.redirect(
            redirectUrl + "?error=" + encodeURIComponent("already connected")
          );
        }

        const exUser1 = await User.findOne({ "snsId.kakao.id": profile.id });
        if (exUser1) {
          return res.redirect(
            redirectUrl + "?error=" + encodeURIComponent("snsId in use")
          );
        }

        // const exUser2 = await User.findOne({
        //   email: profile.email,
        //   _id: { $ne: user._id },
        // });
        // if (exUser2) {
        //   return res.redirect(
        //     redirectUrl + "?error=" + encodeURIComponent("email in use")
        //   );
        // }

        user.snsId = {
          ...user.snsId,
          kakao: {
            id: profile.id,
            email: profile._json && profile._json.kakao_account_email,
            name: profile.displayName,
            picture: profile.profileImage,
          },
        };
        await user.saveReqUser();

        return res.redirect(redirectUrl);
      } catch (err: any) {
        return res.redirect(
          redirectUrl + "?error=" + encodeURIComponent("unknown error occured")
        );
      }
    }
  )(req, res, next);
};

export const disconnectKakao = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    if (!user.snsId?.kakao) {
      return res.status(409).send({ message: "not connected" });
    }

    user.snsId = { ...user.snsId, kakao: undefined };
    await user.saveReqUser();

    return res.status(200).send({
      snsId: user.snsId ?? {},
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
