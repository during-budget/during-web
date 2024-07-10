import { Request, Response } from "express";
import _ from "lodash";

import { FieldInvalidError, FieldRequiredError } from "src/errors/InvalidError";

import * as PaymentService from "src/services/payments";
import * as ItemService from "src/services/items";
import { PaiedAlreadyError } from "src/errors/PaymentError";
import {
  ItemNotFoundError,
  PaymentNotFoundError,
} from "src/errors/NotFoundError";
import { AuthService } from "src/services/users";
import { NotPermittedError } from "src/errors/ForbiddenError";
import { isEnumValue } from "src/lib/const.lib";
import {
  InAppPlatform,
  CompletePaymentByMobileUserReq,
  validateIOSPayload,
} from "src/types/payment";

export const prepare = async (req: Request, res: Response) => {
  const user = req.user!;

  /* validate */
  if (!("itemTitle" in req.body)) throw new FieldRequiredError("itemTitle");
  const itemTitle = req.body.itemTitle;

  // if (user.isGuest) {
  //   return res.status(403).send({ message: NOT_PERMITTED });
  // }

  const { payment: exPayment } = await PaymentService.findPaymentPaidByTitle(
    user,
    itemTitle
  );
  if (exPayment) throw new PaiedAlreadyError();

  const { item } = await ItemService.findByTitle(itemTitle);
  if (!item) throw new ItemNotFoundError();

  const { payment } = await PaymentService.createPaymentReady(user, item);

  return res.status(200).send({
    payment,
  });
};

export const completeByUser = async (req: Request, res: Response) => {
  const user = req.user!;

  /* validate */
  for (let field of ["imp_uid", "merchant_uid"]) {
    if (!(field in req.body)) throw new FieldRequiredError(field);
  }

  const imp_uid = req.body.imp_uid as string;

  const { payment } = await PaymentService.completePaymentByUser(user, imp_uid);
  return res.status(200).send({ payment });
};

export const completeByWebhook = async (req: Request, res: Response) => {
  /* validate */
  for (let field of ["imp_uid", "merchant_uid", "status"]) {
    if (!(field in req.body)) throw new FieldRequiredError(field);
  }

  const imp_uid = req.body.imp_uid as string;

  await PaymentService.completePaymentByWebhook(imp_uid);
  return res.status(200).send();
};

export const completePaymentByMobileUser = async (
  { user, body }: Request,
  res: Response
) => {
  /** validateReq */
  const validateReq = (body: Record<string, any>): void => {
    /** validate platform */

    if (!("platform" in body)) throw new FieldRequiredError("flatform");

    const platform = body.platform;

    if (typeof platform !== "string" || !isEnumValue(InAppPlatform, platform))
      throw new FieldInvalidError("flatform");

    switch (platform) {
      case InAppPlatform.Android: {
        for (let field of ["title", "token"]) {
          if (!(field in body)) throw new FieldRequiredError(field);
        }

        return;
      }

      case InAppPlatform.IOS: {
        for (let field of ["payload"]) {
          if (!(field in body)) throw new FieldRequiredError(field);
        }

        if (!validateIOSPayload(body.payload)) {
          throw new FieldInvalidError("payload");
        }

        return;
      }

      default: {
        throw new Error(
          `Unexpected Error; Not supported platform (${platform})`
        );
      }
    }
  };

  validateReq(body);

  const payment = await PaymentService.completePaymentByMobileUser(
    body as CompletePaymentByMobileUserReq,
    user!
  );

  return res.status(200).send({ payment });
};

export const find = async (req: Request, res: Response) => {
  const user = req.user!;

  let userId: any = user._id;
  if ("userId" in req.query) {
    if (!AuthService.isAdmin(user)) throw new NotPermittedError();
    userId = req.query.userId as string;
  }

  const { payments } = await PaymentService.findPaymentsByUserId(userId);
  return res.status(200).send({ payments });
};

export const remove = async (req: Request, res: Response) => {
  const paymentId = req.params._id as string;

  const { payment } = await PaymentService.findPaymentById(paymentId);
  if (!payment) throw new PaymentNotFoundError();

  await PaymentService.remove(payment);

  return res.status(200).send({});
};
