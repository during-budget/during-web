import { Request, Response } from "express";
import _ from "lodash";

import { PaymentMethodService } from "src/services/users";
import { FieldRequiredError } from "errors/InvalidError";

export const update = async (req: Request, res: Response) => {
  const user = req.user!;

  /* validate */
  if (!("paymentMethods" in req.body))
    throw new FieldRequiredError("paymentMethods");
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
