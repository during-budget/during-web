const _ = require("lodash");
const mongoose = require("mongoose");
const Budget = require("../models/Budget");

// budget controller

/**
 * Create budget
 *
 * @body { startDate,endDate, title, ammountBudget, categories}
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
      ammountBudget: req.body.ammountBudget,
      categories: req.body.categories,
    });

    for (let i = 0; i < budget.categories.length; i++) {
      const category = _.find(user.categories, {
        _id: mongoose.Types.ObjectId(budget.categories[i].categoryId),
      });

      if (!category)
        return res.status(404).send({
          message: `category with _id ${budget.categories[i].categoryId} not found`,
        });
      budget.categories[i].isExpense = category.isExpense;
      budget.categories[i].title = category.title;
      budget.categories[i].icon = category.icon;
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
 * @body { startDate?, endDate? title?, ammountBudget?}
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
    budget.ammountBudget = req.body.ammountBudget ?? budget.ammountBudget;
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
      return res.status(200).send({ budget });
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
