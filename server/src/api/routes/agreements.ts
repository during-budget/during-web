import express, { Response } from "express";
const router = express.Router();
import { body } from "express-validator";
import { wrapAsync } from "../middleware/error";
import { isAdmin, isLoggedIn } from "../middleware/auth";
import * as agreements from "src/api/services/agreement";
import { validatorErrorChecker } from "../middleware/validator";
import {
  Agreement,
  AgreementType,
  convertToAgreement,
} from "src/types/agreement";

router.post(
  "/",
  isAdmin,
  [
    body("type")
      .exists()
      .isIn([AgreementType.TermsOfUse, AgreementType.PrivacyPolicy]),
    body("version").exists().isString(),
    validatorErrorChecker,
  ],
  wrapAsync(
    async (
      req: { body: { type: AgreementType; version: string } },
      res: Response<{ agreement: Agreement }>
    ) => {
      const agreement = await agreements.createAgreement(req.body);

      return res.status(200).send({
        agreement: convertToAgreement(agreement),
      });
    }
  )
);

router.get(
  "/",
  isLoggedIn,
  wrapAsync(
    async (
      req: Request,
      res: Response<{
        agreement: {
          termsOfUse: Agreement;
          privacyPolicy: Agreement;
        };
      }>
    ) => {
      const { termsOfUseAgreement, privacyPolicyAgreement } =
        await agreements.findValidAgreements();

      return res.status(200).send({
        agreement: {
          termsOfUse: convertToAgreement(termsOfUseAgreement),
          privacyPolicy: convertToAgreement(privacyPolicyAgreement),
        },
      });
    }
  )
);

export default router;
