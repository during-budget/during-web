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

    for (let _category of req.body.expenseCategories) {
      const category = user.findCategory({
        isExpense: true,
        categoryId: _category.categoryId,
      });

      if (!category)
        return res.status(404).send({
          message: `category with _id ${_category.categoryId} not found`,
        });
      console.log("category: ", category);
      budget.expenseCategories.push({
        ...category,
        categoryId: _category.categoryId,
        ammount: _category.ammount,
      });
    }

    for (let _category of req.body.incomeCategories) {
      const category = user.findCategory({
        isExpense: false,
        categoryId: _category.categoryId,
      });
      if (!category)
        return res.status(404).send({
          message: `category with _id ${budget.categories[i].categoryId} not found`,
        });
      budget.incomeCategories.push({
        ...category,
        categoryId: _category.categoryId,
        ammount: _category.ammount,
      });
    }

    await budget.save();

    return res.status(200).send({ budget });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update budget category
 *
 * @param {_id, categoryId}
 * @body {  _id?, ammount }
 * @return budget
 */
module.exports.updateCategory = async (req, res) => {
  try {
    const user = req.user;
    const budget = await Budget.findById(req.params._id);
    if (!budget.userId.equals(user._id)) return res.status(401).send();

    const idx = _.findIndex(budget.categories, {
      categoryId: mongoose.Types.ObjectId(req.params.categoryId),
    });
    if (idx === -1)
      return res.status(404).send({
        message: `category with _id ${req.params.categoryId} not found`,
      });

    if (req.body.categoryId && req.params.categoryId !== req.body.categoryId) {
      const category = _.find(user.categories, {
        _id: mongoose.Types.ObjectId(req.body.categoryId),
      });

      if (!category)
        return res.status(404).send({
          message: `category with categoryId ${req.body.categoryId} not found`,
        });

      budget.categories[idx].categoryId = category._id;
      budget.categories[idx].isExpense = category.isExpense;
      budget.categories[idx].title = category.title;
      budget.categories[idx].icon = category.icon;
    }

    budget.categories[idx].ammount = req.body.ammount;
    await budget.save();

    return res.status(200).send({ budget });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update budget fields
 *
 * @body { startDate?, endDate? title?, expensePlanned?}
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
      return res.status(200).send({ budget, transactions });
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
