import { Request, Response } from "express";
import _ from "lodash";
import { Types } from "mongoose";

import { IPaymentMethod } from "../models/User";

import { logger } from "../log/logger";

export const update = async (req: Request, res: Response) => {
  try {
    /* validate */
    if (!("paymentMethods" in req.body))
      return res
        .status(409)
        .send({ message: "field 'paymentMethods' is required" });

    const user = req.user!;
    if (!user.paymentMethods) user.paymentMethods = new Types.DocumentArray([]);

    const _paymentMethods: Types.DocumentArray<IPaymentMethod> =
      new Types.DocumentArray([]);

    const exAssetsAndCards = [
      ...user.assets.map((asset: any) => {
        return { ...asset.toObject(), type: "asset" };
      }),
      ...user.cards.map((card: any) => {
        return { ...card.toObject(), type: "card" };
      }),
    ];

    for (let _paymentMethod of req.body.paymentMethods) {
      if (!("_id" in _paymentMethod)) {
        return res.status(400).send({ message: "field '_id' is required" });
      }

      const exPaymentMethod = _.find(exAssetsAndCards, {
        _id: new Types.ObjectId(_paymentMethod._id),
      }) as IPaymentMethod;

      if (!exPaymentMethod) {
        return res
          .status(404)
          .send({ message: "paymentMethod not found", exAssetsAndCards });
      }
      /* include paymentMethod */
      _paymentMethods.push(exPaymentMethod);
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
