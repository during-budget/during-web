import { Request, Response } from "express";
import _ from "lodash";
import { logger } from "../log/logger";

export const find = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    return res.status(200).send({
      settings: user.settings,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    user.settings = {
      chartSkin: req.body.chartSkin ?? user.settings.chartSkin,
    };

    await user.saveReqUser();
    return res.status(200).send({
      settings: user.settings,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
