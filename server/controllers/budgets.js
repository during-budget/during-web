const _ = require("lodash");
const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// budget controller

/**
 * Create budget
 *
 * @body { startDate,endDate, title, expensePlanned,incomePlanned,categories}
 * @return budget
 */

module.exports.create = async (req, res) => {
  try {
    const user = req.user;

    const budget = new Budget({
      userId: user._id,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      title: req.body.title,
      expensePlanned: req.body.expensePlanned,
      incomePlanned: req.body.incomePlanned,
    });

    for (let _category of req.body.categories) {
      const category = user.findCategory(_category.categoryId);

      if (!category)
        return res.status(404).send({
          message: `category with _id ${_category.categoryId} not found`,
        });

      if (!("amountPlanned" in _category))
        return res
          .status(400)
          .send({ message: "field 'amountPlanned' is required" });
      budget.categories.push({
        ...category,
        categoryId: _category.categoryId,
        amountPlanned: _category.amountPlanned,
      });
    }
    await budget.save();

    return res.status(200).send({ budget });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * create budget category
 *
 * @param {_id}
 * @body {  categoryId, amountPlanned }
 * @return budget
 */
module.exports.createCategory = async (req, res) => {
  try {
    const user = req.user;
    const budget = await Budget.findById(req.params._id);
    if (!budget.userId.equals(user._id)) return res.status(401).send();

    const exCategory = budget.findCategory(req.body.categoryId);
    if (exCategory) {
      return res.status(409).send({
        message: `budget category with _id ${req.body.categoryId} already exists`,
      });
    }

    const category = user.findCategory(req.body.categoryId);
    if (!category) {
      return res.status(404).send({
        message: `user category with _id ${req.body.categoryId} not found`,
      });
    }
    if (!("amountPlanned" in req.body))
      return res
        .status(400)
        .send({ message: "field 'amountPlanned' is required" });

    budget.categories.push({
      ...category,
      categoryId: category._id,
      amountPlanned: req.body.amountPlanned,
    });

    await budget.save();

    return res.status(200).send({ budget });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update budget category amountPlanned
 *
 * @param {_id, categoryId}
 * @body {  amount }
 * @return budget
 */
module.exports.updateCategoryAmountPlanned = async (req, res) => {
  try {
    if (!req.query.categoryId) return res.status(400).send();
    if (!("amountPlanned" in req.body))
      return res
        .status(400)
        .send({ message: "field 'amountPlanned' is required" });

    const user = req.user;
    const budget = await Budget.findById(req.params._id);
    if (!budget.userId.equals(user._id)) return res.status(401).send();

    const idx = budget.findCategoryIdx(req.query.categoryId);
    if (idx === -1)
      return res.status(404).send({
        message: `budget category with _id ${req.query.categoryId} not found`,
      });

    budget.categories[idx].amountPlanned = req.body.amountPlanned;
    await budget.save();

    return res.status(200).send({ budget });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * remove budget category
 *
 * @param {_id}
 * @return budget
 */
module.exports.removeCategory = async (req, res) => {
  try {
    const user = req.user;
    const budget = await Budget.findById(req.params._id);
    if (!budget) return res.status(404).send({ message: "budget not found" });
    if (!budget.userId.equals(user._id)) return res.status(401).send();

    const idx = budget.findCategoryIdx(req.query.categoryId);
    if (idx === -1) {
      return res.status(404).send({
        message: `budget category with _id ${req.query.categoryId} not found`,
      });
    }

    // 해당 카테고리를 사용하는 transaction이 존재하는가?
    const transactions = await Budget.find({
      userId: user._id,
      "categories.categoryId": req.query.categoryId,
    });
    if (transactions.length > 0)
      return res.status(409).send({
        message: "해당 카테고리를 사용하는 거래내역이 있습니다.",
        transactions,
      });

    budget.categories.splice(idx, 1);
    await budget.save();

    return res.status(200).send({ budget });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update budget fields
 *
 * @body { startDate?, endDate? title?, expensePlanned?, incomePlanned?}
 * @return budget
 */
module.exports.updateField = async (req, res) => {
  try {
    const user = req.user;
    const budget = await Budget.findById(req.params._id);
    if (!budget.userId.equals(user._id)) return res.status(401).send();

    budget.startDate = req.body.startDate ?? budget.startDate;
    budget.endDate = req.body.endDate ?? budget.endDate;
    budget.title = req.body.title ?? budget.title;
    budget.expensePlanned = req.body.expensePlanned ?? budget.expensePlanned;
    budget.incomePlanned = req.body.incomePlanned ?? budget.incomePlanned;
    await budget.save();

    return res.status(200).send({ budget });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Find budget
 *
 * @param { _id?}
 * @return budget or budgets
 */
module.exports.find = async (req, res) => {
  try {
    const user = req.user;

    if (req.params._id) {
      const budget = await Budget.findById(req.params._id);
      if (!budget) return res.status(404).send();
      if (!budget.userId.equals(user._id)) return res.status(401).send();

      const transactions = await Transaction.find({ budgetId: budget._id });
      // return res.status(200).send({ budget, transactions });

      return res.status(200).send({
        message: "check",
        budget: {
          title: budget.title,
          expenseScheduled: budget.expenseScheduled,
          expenseCurrent: budget.expenseCurrent,
          expensePlanned: budget.expensePlanned,
          incomeScheduled: budget.incomeScheduled,
          incomeCurrent: budget.incomeCurrent,
          incomePlanned: budget.incomePlanned,
          categories: budget.categories.map((cat) => {
            return {
              categoryId: cat.categoryId,
              title: cat.title,
              amountPlanned: cat.amountPlanned,
              amountScheduled: cat.amountScheduled,
              amountCurrent: cat.amountCurrent,
            };
          }),
        },

        transactions,
      });
    }
    const budgets = await Budget.find({ userId: user._id });
    return res.status(200).send({ budgets });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Remove budget
 *
 * @param { _id}
 */
module.exports.remove = async (req, res) => {
  try {
    const user = req.user;
    const budget = await Budget.findById(req.params._id);
    if (!budget) return res.status(404).send();
    if (!budget.userId.equals(user._id)) return res.status(401).send();
    await budget.remove();
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
