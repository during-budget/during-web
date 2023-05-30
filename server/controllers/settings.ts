import { Request, Response } from "express";
import _ from "lodash";
import { logger } from "@logger";
import { chartSkins } from "@models/_chartSkin";
import { FIELD_INVALID, FIELD_REQUIRED } from "@message";
import moment from "moment";

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

    if ("chartSkin" in req.body) {
      if (!chartSkins.includes(req.body.chartSkin)) {
        return res.status(400).send({ message: FIELD_INVALID("chartSkin") });
      }
      user.settings.chartSkin = req.body.chartSkin;
    }

    if ("timeZone" in req.body) {
      if (!moment.tz.zone(req.body.timeZone)) {
        return res.status(400).send({ message: FIELD_INVALID("timeZone") });
      }
      user.settings.timeZone = req.body.timeZone;
    }

    await user.saveReqUser();
    return res.status(200).send({
      settings: user.settings,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const options = async (req: Request, res: Response) => {
  try {
    if (!("field" in req.query)) {
      return res.status(400).send({ message: FIELD_REQUIRED("field") });
    }
    if (req.query.field === "chartSkin") {
      return res.status(200).send({
        default: "basic",
        options: chartSkins,
      });
    }
    if (req.query.field === "timeZone") {
      return res.status(200).send({
        default: "Asia/Seoul",
        options: moment.tz.names(),
      });
    }
    return res.status(400).send({ message: FIELD_INVALID("field") });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
