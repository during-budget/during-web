import express from "express";
const router = express.Router();
import * as users from "@controllers/users";
import {
  isLoggedIn,
  isNotLoggedIn,
  forceNotLoggedIn,
  isAdmin,
} from "../middleware/auth";

router.put("/", isLoggedIn, users.updateFields);

router.put("/agreement", isLoggedIn, users.updateAgreement);
router.put(
  "/agreement/termsOfUse",
  isLoggedIn,
  users.updateAgreementTermsOfUse
);
router.put(
  "/agreement/privacyPolicy",
  isLoggedIn,
  users.updateAgreementPrivacyPolicy
);

router.get("/current", isLoggedIn, users.current);

/* delete account */
router.delete("/", isLoggedIn, users.remove);

/* admin */
router.get("/", isAdmin, users.list);
router.get("/:_id", isAdmin, users.find);
router.delete("/:_id", isAdmin, users.remove2);

export default router;
