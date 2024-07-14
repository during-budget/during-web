import express, { Request, Response } from "express";
import { isAdmin } from "../middleware/auth";
import { wrapAsync } from "../middleware/error";
import { PaymentService } from "src/services/payment.service";

const router = express.Router();

router.post(
  "/set-isDestroyed",
  // isAdmin,
  wrapAsync(async (req: Request, res: Response) => {
    const { count } = await PaymentService.setIsDestroyed();

    return res.status(200).send({ count });
  })
);

router.post(
  "/destroy-unpaid-payments",
  // isAdmin,
  wrapAsync(async (req: Request, res: Response) => {
    const { count } = await PaymentService.destroyUnpaidPayments();

    return res.status(200).send({ count });
  })
);

export default router;
