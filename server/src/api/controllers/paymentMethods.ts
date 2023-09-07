import { Request, Response } from "express";
import _ from "lodash";

import { FIELD_REQUIRED } from "../message";
import { PaymentMethodService } from "src/services/users";

export const update = async (req: Request, res: Response) => {
  const user = req.user!;

  /* validate */
  if (!("paymentMethods" in req.body))
    return res.status(400).send({ message: FIELD_REQUIRED("paymentMethods") });
  const newPaymentMethods = req.body.paymentMethods;

  await PaymentMethodService.updatePaymentMethods(user, newPaymentMethods);

  return res.status(200).send({ paymentMethods: user.paymentMethods });
};

export const find = async (req: Request, res: Response) => {
  const user = req.user!;

  return res.status(200).send({
    paymentMethods: user.paymentMethods,
  });
};
