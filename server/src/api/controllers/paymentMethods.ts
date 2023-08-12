import { Request, Response } from "express";
import _ from "lodash";
import { Types } from "mongoose";

import { IPaymentMethod } from "@models/User";

import { logger } from "@logger";
import { FIELD_REQUIRED, NOT_FOUND, PM_CANNOT_BE_REMOVED } from "../message";

export const update = async (req: Request, res: Response) => {
  try {
    /* validate */
    if (!("paymentMethods" in req.body))
      return res
        .status(400)
        .send({ message: FIELD_REQUIRED("paymentMethods") });

    const user = req.user!;
    if (!user.paymentMethods) user.paymentMethods = new Types.DocumentArray([]);

    const pmDict: { [key: string]: IPaymentMethod } = Object.fromEntries(
      user.paymentMethods.map((pm: any) => [pm._id, pm.toObject()])
    );

    const _paymentMethods: Types.DocumentArray<IPaymentMethod> =
      new Types.DocumentArray([]);

    for (let _pm of req.body.paymentMethods) {
      if (!("_id" in _pm)) {
        return res.status(400).send({ message: FIELD_REQUIRED("_id") });
      }
      if (!("isChecked" in _pm)) {
        return res.status(400).send({ message: FIELD_REQUIRED("isChecked") });
      }

      /* update pm */
      const key = _pm._id;
      const exPM = pmDict[key];
      if (!exPM) return res.status(404).send({ message: NOT_FOUND("PM") });

      _paymentMethods.push({
        ...exPM,
        isChecked: _pm.isChecked,
      });
      delete pmDict[key];
    }
    /* block removing pm */
    if (Object.keys(pmDict).length > 0) {
      return res.status(409).send({ message: PM_CANNOT_BE_REMOVED });
    }

    user.paymentMethods = _paymentMethods;
    await user.saveReqUser();
    return res.status(200).send({ paymentMethods: user.paymentMethods });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const find = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    return res.status(200).send({
      paymentMethods: user.paymentMethods,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
