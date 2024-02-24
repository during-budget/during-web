import express, { Response } from "express";
const router = express.Router();
import * as users from "src/api/controllers/users";
import * as userService from "src/api/services/user";
import { isLoggedIn, isAdmin } from "src/api/middleware/auth";
import { wrapAsync } from "../middleware/error";
import { body } from "express-validator";
import { validatorErrorChecker } from "../middleware/validator";
import { UserEntity } from "@models/User";
import { User } from "src/types/user";

router.put("/", isLoggedIn, wrapAsync(users.updateFields));

router.put(
  "/agreement",
  isLoggedIn,
  [
    body("termsOfUse").exists().isString(),
    body("privacyPolicy").exists().isString(),
    validatorErrorChecker,
  ],
  wrapAsync(
    async (
      req: {
        user: UserEntity;
        body: {
          termsOfUse: string;
          privacyPolicy: string;
        };
      },
      res: Response<{
        agreement: {
          termsOfUse: string;
          privacyPolicy: string;
        };
      }>
    ) => {
      const agreement = await userService.updateAgreement(req.user, req.body);

      return res.status(200).send({
        agreement,
      });
    }
  )
);

router.get(
  "/current",
  isLoggedIn,
  wrapAsync(
    async (
      req: {
        user: UserEntity;
      },
      res: Response<{
        user: User;
      }>
    ) => {
      const user = await userService.current(req.user);

      return res.status(200).send({
        user,
      });
    }
  )
);

/* delete account */
router.delete("/", isLoggedIn, wrapAsync(users.remove));

/* admin */
router.get("/", isAdmin, wrapAsync(users.listByAdmin));
router.get("/:_id", isAdmin, wrapAsync(users.findByAdmin));
router.delete("/:_id", isAdmin, wrapAsync(users.removeByAdmin));

export default router;
