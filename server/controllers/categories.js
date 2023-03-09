const _ = require("lodash");
const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const { updateCategory } = require("./transactions");
const compareById = require("../utils/compareById");

// category settings controller

module.exports.updateV2 = async (req, res) => {
  try {
    if (!("categories" in req.body))
      return res
        .status(409)
        .send({ message: "field 'categories' is required" });

    const user = req.user;

    const _categories = user.categories;
    const defaultExpenseCategory = user.findDefaultExpenseCategory();
    const defaultIncomeCategory = user.findDefaultIncomeCategory();
    user.categories = [
      ...req.body.categories,
      defaultExpenseCategory,
      defaultIncomeCategory,
    ];
    await user.save();

    const { updated, added, removed } = compareById(
      _categories,
      user.categories,
      (c1, c2) => c1?.title === c2?.title && c1?.icon === c2?.icon
    );

    for (const category of updated) {
      // update budgets and transactions categories

      const budgets = await Budget.find({
        userId: user._id,
        "categories.categoryId": category._id,
      });
      const transactions = await Transaction.find({
        userId: user._id,
        "category.categoryId": category._id,
      });

      await Promise.all([
        budgets.forEach((budget) => {
          const idx = budget.findCategoryIdx(category._id);
          budget.categories[idx] = {
            ...category,
            categoryId: category._id,
            amount: budget.categories[idx].amount,
          };
          budget.save();
        }),
        transactions.forEach((transaction) => {
          transaction.category = {
            ...category,
            categoryId: category._id,
          };
          transaction.save();
        }),
      ]);
    }

    for (const category of removed) {
      const budgets = await Budget.find({
        userId: user._id,
        "categories.categoryId": category._id,
      });
      const transactions = await Transaction.find({
        userId: user._id,
        "category.categoryId": category._id,
      });

      await Promise.all([
        budgets.forEach((budget) => {
          const idx = budget.findCategoryIdx(budget.categories, category._id);
          budget.categories.splice(idx, 1);
          budget.save();
        }),
        transactions.forEach((transaction) => {
          if (transaction.category.isExpense) {
            transaction.category = {
              ...defaultExpenseCategory,
              categoryId: defaultExpenseCategory._id,
            };
          } else {
            transaction.category = {
              ...defaultIncomeCategory,
              categoryId: defaultIncomeCategory._id,
            };
          }

          transaction.save();
        }),
      ]);
    }

    return res.status(200).send({ updated, added, removed });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Create category setting element
 *
 * @body {isExpense: boolean, isIncome:boolean, title: String, icon: String}
 * @return categories
 */
module.exports.create = async (req, res) => {
  try {
    if (!("title" in req.body) || !("icon" in req.body))
      return res.status(409).send({ message: "title and icon is required" });
    if (!("isExpense" in req.body) || !("isIncome" in req.body))
      return res
        .status(409)
        .send({ message: "isExpense and isIncome is required" });

    req.user.pushCategory(req.body);
    await req.user.save();

    return res.status(200).send({ categories: req.user.categories });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Read user's category settings
 *
 * @return categories
 */
module.exports.find = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).send({ categories: user.categories });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update user's category setting element
 *
 * @param {_id: oid}
 * @body {isExpense: boolean, isIncome:boolean, title: String, icon: String}
 * @return categories
 */
module.exports.update = async (req, res) => {
  try {
    if (!("title" in req.body) || !("icon" in req.body))
      return res.status(409).send({ message: "title and icon is required" });
    if (!("isExpense" in req.body) || !("isIncome" in req.body))
      return res
        .status(409)
        .send({ message: "isExpense and isIncome is required" });
    const user = req.user;

    const idx = _.findIndex(user.categories, {
      _id: mongoose.Types.ObjectId(req.params._id),
    });
    if (idx === -1) return res.status(404).send();
    if (user.categories[idx].isDefault)
      return res
        .status(409)
        .send({ message: "default category cannot be updated" });

    user.categories[idx] = {
      _id: user.categories[idx]._id,
      isExpense: req.body.isExpense,
      isIncome: req.body.isIncome,
      title: req.body.title,
      icon: req.body.icon,
    };

    await user.save();

    // update budgets and transactions categories
    const category = {
      ...user.categories[idx].toObject(),
      categoryId: user.categories[idx]._id,
    };
    const budgets = await Budget.find({
      userId: user._id,
      "categories.categoryId": category._id,
    });
    const transactions = await Transaction.find({
      userId: user._id,
      "category.categoryId": category._id,
    });

    await Promise.all([
      budgets.forEach((budget) => {
        const idx = _.findIndex(budget.categories, {
          categoryId: category._id,
        });
        budget.categories[idx] = {
          ...category,
          amount: budget.categories[idx].amount,
        };
        budget.save();
      }),
      transactions.forEach((transaction) => {
        transaction.category = {
          ...category,
        };
        transaction.save();
      }),
    ]);

    return res
      .status(200)
      .send({ categories: user.categories, budgets, transactions });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Swap user's category setting elements
 *
 * @body {_id1: oid, _id2: oid}
 * @return categories
 */
module.exports.swap = async (req, res) => {
  try {
    if (!req.body._id1 || !req.body._id2)
      return res.status(409).send({ message: "_id1 and _id2 is required" });

    const user = req.user;

    const idx1 = _.findIndex(user.categories, {
      _id: mongoose.Types.ObjectId(req.body._id1),
    });
    if (idx1 === -1) return res.status(404).send();
    if (user.categories[idx1].isDefault)
      return res
        .status(409)
        .send({ message: "default category cannot be swapped" });
    const idx2 = _.findIndex(user.categories, {
      _id: mongoose.Types.ObjectId(req.body._id2),
    });
    if (idx2 === -1) return res.status(404).send();
    if (user.categories[idx2].isDefault)
      return res
        .status(409)
        .send({ message: "default category cannot be swapped" });

    const temp = user.categories[idx1];
    user.categories[idx1] = user.categories[idx2];
    user.categories[idx2] = temp;

    await user.save();

    return res.status(200).send({ categories: user.categories });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Remove user's category setting element
 *
 * @param {_id: oid}
 * @return categories
 */
module.exports.remove = async (req, res) => {
  try {
    const user = req.user;

    const idx = _.findIndex(user.categories, {
      _id: mongoose.Types.ObjectId(req.params._id),
    });
    if (idx === -1) return res.status(404).send();
    if (user.categories[idx].isDefault)
      return res
        .status(409)
        .send({ message: "default category cannot be removed" });

    // 해당 카테고리를 사용하는 budget이 존재하는가?
    const budgets = await Budget.find({
      userId: user._id,
      "categories.categoryId": req.params._id,
    });
    if (budgets.length > 0)
      return res.status(409).send({
        message: "해당 카테고리를 사용하는 예산이 있습니다.",
        budgets,
      });

    user.categories.splice(idx, 1);
    await user.save();

    return res.status(200).send({ categories: user.categories });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
