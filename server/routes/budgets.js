const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");

const budgets = require("../controllers/budgets");

router.post("/", isLoggedIn, budgets.create);

router.post("/:_id/category", isLoggedIn, budgets.createCategory);
router.put("/:_id/category/amount", isLoggedIn, budgets.updateCategoryamount);
router.delete("/:_id/category", isLoggedIn, budgets.removeCategory);

router.patch("/:_id", isLoggedIn, budgets.updateField);

router.get("/:_id?", isLoggedIn, budgets.find);
router.delete("/:_id", isLoggedIn, budgets.remove);

module.exports = router;
