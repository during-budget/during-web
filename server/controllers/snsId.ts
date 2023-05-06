import { Request, Response } from "express";
import _ from "lodash";

import { logger } from "../log/logger";
import { getPayload } from "../utils/payload";
import { User } from "../models/User";

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
      "snsId.google": payload.email,
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

    user.snsId = { ...user.snsId, google: payload.email };
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
