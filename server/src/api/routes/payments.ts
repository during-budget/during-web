import express, { Request, Response } from "express";
import { isLoggedIn, isPortOneWebHook, isAdmin } from "src/api/middleware/auth";
import { wrapAsync } from "src/api/middleware/error";
import { FieldRequiredError, FieldInvalidError } from "src/errors/InvalidError";
import { isEnumValue } from "src/lib/const.lib";
import {
  InAppPlatform,
  validateIOSPayload,
  CompletePaymentByMobileUserReq,
  validateAndroidPayload,
} from "src/types/payment";

import * as paymentController from "src/api/controllers/payments";
import * as PaymentService from "src/services/payments";

const router = express.Router();

router.post("/prepare", isLoggedIn, wrapAsync(paymentController.prepare));
router.post(
  "/complete",
  isLoggedIn,
  wrapAsync(paymentController.completeByUser)
);
router.post(
  "/complete/webhook",
  isPortOneWebHook,
  wrapAsync(paymentController.completeByWebhook)
);

/** CompleteByMobileUser */
router.post(
  "/complete-by-mobile-user",
  isLoggedIn,
  wrapAsync(async ({ user, body }: Request, res: Response) => {
    /** validateReq */
    if (
      !((body: Record<string, any>): body is CompletePaymentByMobileUserReq => {
        /** validate platform */

        if (!("platform" in body)) throw new FieldRequiredError("flatform");
        if (!("payload" in body)) throw new FieldRequiredError("payload");

        const { platform, payload } = body;

        if (
          typeof platform !== "string" ||
          !isEnumValue(InAppPlatform, platform)
        )
          throw new FieldInvalidError("flatform");

        switch (platform) {
          case InAppPlatform.Android: {
            if (!validateAndroidPayload(payload)) {
              throw new FieldInvalidError("payload");
            }

            return true;
          }

          case InAppPlatform.IOS: {
            if (!validateIOSPayload(payload)) {
              throw new FieldInvalidError("payload");
            }

            return true;
          }

          default: {
            throw new Error(
              `Unexpected Error; Not supported platform (${platform})`
            );
          }
        }
      })(body)
    ) {
      throw new Error("Unexpected Error; request is not valid");
    }

    const payment = await PaymentService.completePaymentByMobileUser(
      body,
      user!
    );

    return res.status(200).send({ payment });
  })
);

router.get("/", isLoggedIn, wrapAsync(paymentController.find));

router.delete("/:_id", isAdmin, wrapAsync(paymentController.remove));

export default router;
