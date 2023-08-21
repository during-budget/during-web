import express from "express";
const router = express.Router();
import * as users from "src/api/controllers/users";
import { isLoggedIn, isAdmin } from "src/api/middleware/auth";
import { wrapAsync } from "../middleware/error";

router.put("/", isLoggedIn, wrapAsync(users.updateFields));

router.put("/agreement", isLoggedIn, users.updateAgreement);
router.put(
  "/agreement/termsOfUse",
  isLoggedIn,
  wrapAsync(users.updateAgreementTermsOfUse)
);
router.put(
  "/agreement/privacyPolicy",
  isLoggedIn,
  wrapAsync(users.updateAgreementPrivacyPolicy)
);

router.get("/current", isLoggedIn, users.current);

/* delete account */
router.delete("/", isLoggedIn, wrapAsync(users.remove));

/* admin */
router.get("/", isAdmin, wrapAsync(users.listByAdmin));
router.get("/:_id", isAdmin, wrapAsync(users.findByAdmin));
router.delete("/:_id", isAdmin, wrapAsync(users.removeByAdmin));

export default router;
