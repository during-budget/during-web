const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");

const budgets = require("../controllers/budgets");

router.post("/", isLoggedIn, budgets.create);
router.put("/:_id/categories/:categoryId", isLoggedIn, budgets.updateCategory);
router.patch("/:_id", isLoggedIn, budgets.updateField);
router.get("/:_id?", isLoggedIn, budgets.find);
router.delete("/:_id", isLoggedIn, budgets.remove);

module.exports = router;
