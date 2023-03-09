const _ = require("lodash");
const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// transaction controller

/**
 * Create transaction
 *
 * @body { budgetId, date, isCurrent, isExpense, isIncome, title: [String], amount: Number, categoryId, tags?, memo?, linkId?}
 * @return transaction
 */

module.exports.create = async (req, res) => {
  try {
    for (let field of [
      "budgetId",
      "date",
      "isCurrent",
      "isExpense",
      "isIncome",
      "title",
      "amount",
      "categoryId",
    ])
      if (!(field in req.body))
        return res.status(400).send({
          message: `fields(budgetId, date, isCurrent, isExpense, isIncome, title, amount, categoryId) are required`,
        });
    if (req.body.isExpense === req.body.isIncome)
      return res.status(400).send({
        message:
          "set {isExpense:true, isIncome:false} or {isExpense:false, isIncome:true}",
      });

    const user = req.user;

    const budget = await Budget.findById(req.body.budgetId);
    if (!budget)
      return res
        .status(404)
        .send({ message: `budget(${req.body.budgetId}) not found` });

    const category = _.find(budget.categories, {
      categoryId: mongoose.Types.ObjectId(req.body.categoryId),
    });
    if (!category)
      return res.status(404).send({
        message: `category(${req.body.categoryId}) not found in budget`,
      });

    if (req.body.isExpense !== category.isExpense)
      return res.status(409).send({
        message: `field isExpense and category(${JSON.stringify(
          category
        )}) does not match`,
      });
    else if (req.body.isIncome !== category.isIncome)
      return res.status(409).send({
        message: `field isIncome and category(${JSON.stringify(
          category
        )}) does not match`,
      });

    const transaction = new Transaction({
      userId: req.user._id,
      budgetId: budget._id,
      date: req.body.date,
      isCurrent: req.body.isCurrent,
      isExpense: req.body.isExpense,
      isIncome: req.body.isIncome,
      linkId: req.body.linkId,
      title: req.body.title,
      amount: req.body.amount,
      category: {
        categoryId: category.categoryId,
        isExpense: category.isExpense,
        isIncome: category.isIncome,
        title: category.title,
        icon: category.icon,
      },
      tags: req.body.tags ?? [],
      memo: req.body.memo ?? "",
    });
    if (transaction.isCurrent && transaction?.linkId) {
      const transactionScheduled = await Transaction.findByIdAndUpdate(
        { _id: transaction.linkId },
        { linkId: transaction._id }
      );
      transaction.overAmount = transaction.amount - transactionScheduled.amount;
    }
    await transaction.save();

    // 1. scheduled transaction
    if (!transaction.isCurrent) {
      category.amountScheduled += transaction.amount;

      // 1-1. expense transaction
      if (transaction.isExpense) {
        budget.expenseScheduled += transaction.amount;
      }
      // 1-2. income transaction
      else if (transaction.isIncome) {
        budget.incomeScheduled += transaction.amount;
      }
    }
    // 2. current transaction
    else {
      category.amountCurrent += transaction.amount;

      // 2-1. expense transaction
      if (transaction.isExpense) {
        budget.expenseCurrent += transaction.amount;
      }
      // 2-2. income transaction
      else if (transaction.isIncome) {
        budget.incomeCurrent += transaction.amount;
      }
    }
    await budget.save();

    return res.status(200).send({ transaction });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update transaction category
 *
 * @param {_id: transactionId}
 * @body { categoryId }
 * @return transaction
 */
module.exports.updateCategory = async (req, res) => {
  try {
    if (!("categoryId" in req.body))
      return res.status(400).send({ message: "field 'categoryId' is missing" });

    const user = req.user;
    const transaction = await Transaction.findById(req.params._id);
    if (!transaction)
      return res.status(404).send({ message: "transaction not found" });
    if (!transaction.userId.equals(user._id)) return res.status(401).send();

    const budget = await Budget.findById(transaction.budgetId);
    if (!budget)
      return res
        .status(404)
        .send({ message: `budget(${transaction.budgetId}) not found` });

    const oldCategoryIdx = budget.findCategoryIdx(
      transaction.category.categoryId
    );
    if (oldCategoryIdx === -1)
      return res.status(404).send({
        message: `old category(${transaction.category.categoryId}) not found in budget`,
        transaction,
      });
    const oldCategory = budget.categories[oldCategoryIdx];

    const newCategoryIdx = budget.findCategoryIdx(req.body.categoryId);
    if (newCategoryIdx === -1)
      return res.status(404).send({
        message: `category(${req.body.categoryId}) not found in budget`,
        transaction,
      });
    const newCategory = budget.categories[newCategoryIdx];

    transaction.category = {
      ...newCategory,
      categoryId: newCategory._id,
    };
    await transaction.save();

    // 1. scheduled transaction
    if (!transaction.isCurrent) {
      oldCategory.amountScheduled -= transaction.amount;
      newCategory.amountScheduled += transaction.amount;
    }
    // 2. current transaction
    else {
      oldCategory.amountCurrent -= transaction.amount;
      newCategory.amountCurrent += transaction.amount;
    }

    if (transaction.linkId) {
      const transactionLinked = await Transaction.findById(transaction.linkId);
      if (!transactionLinked)
        return res
          .status(404)
          .send({ message: "linked transaction not found" });
      if (!transactionLinked.userId.equals(user._id))
        return res.status(401).send();

      transactionLinked.category = {
        ...newCategory,
        categoryId: newCategory._id,
      };
      await transactionLinked.save();

      // 1. scheduled transaction
      if (!transactionLinked.isCurrent) {
        oldCategory.amountScheduled -= transactionLinked.amount;
        newCategory.amountScheduled += transactionLinked.amount;
      }
      // 2. current transaction
      else {
        oldCategory.amountCurrent -= transactionLinked.amount;
        newCategory.amountCurrent += transactionLinked.amount;
      }
    }

    budget.categories[oldCategoryIdx] = oldCategory;
    budget.categories[newCategoryIdx] = newCategory;
    budget.isModified("categories");
    await budget.save();

    return res.status(200).send({ transaction });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update transaction field
 *
 * @param {_id: transactionId}
 * @body { date?, title?,  tags?, memo? }
 * @return transaction
 */
module.exports.updateField = async (req, res) => {
  try {
    const user = req.user;
    const transaction = await Transaction.findById(req.params._id);
    if (!transaction) return res.status(404).send();
    if (!transaction.userId.equals(user._id)) return res.status(401).send();

    transaction.date = req.body.date ?? transaction.date;
    transaction.title = req.body.title ?? transaction.title;
    transaction.tags = req.body.tags ?? transaction.tags;
    transaction.memo = req.body.memo ?? transaction.memo;
    await transaction.save();

    return res.status(200).send({ transaction });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update transaction amount
 *
 * @param {_id: transactionId}
 * @body { amount }
 * @return transaction
 */
module.exports.updateAmount = async (req, res) => {
  try {
    if (!("amount" in req.body))
      return res.status(400).send({ message: "field 'amount' is missing" });

    const user = req.user;
    const transaction = await Transaction.findById(req.params._id);
    if (!transaction)
      return res.status(404).send({ message: "transaction not found" });
    if (!transaction.userId.equals(user._id)) return res.status(401).send();

    const diff = req.body.amount - transaction.amount;
    transaction.amount = req.body.amount;

    const budget = await Budget.findById(transaction.budgetId);
    if (!budget)
      return res
        .status(404)
        .send({ message: `budget(${transaction.budgetId}) not found` });

    const categoryIdx = budget.findCategoryIdx(transaction.category.categoryId);
    if (categoryIdx === -1)
      return res.status(404).send({
        message: `category(${transaction.category.categoryId}) not found in budget`,
        transaction,
      });

    const category = budget.categories[categoryIdx];

    // 1. scheduled transaction
    if (!transaction.isCurrent) {
      if (transaction.linkId) {
        const transactionCurrent = await Transaction.findById(
          transaction.linkId
        );
        transactionCurrent.overAmount -= diff;
        await transactionCurrent.save();
      }
      category.amountScheduled += diff;

      // 1-1. expense transaction
      if (transaction.isExpense) {
        budget.expenseScheduled += diff;
      }
      // 1-2. income transaction
      else if (transaction.isIncome) {
        budget.incomeScheduled += diff;
      }
    }
    // 2. current transaction
    else {
      transaction.overAmount += diff;
      category.amountCurrent += diff;

      // 2-1. expense transaction
      if (transaction.isExpense) {
        budget.expenseCurrent += diff;
      }
      // 2-2. income transaction
      else if (transaction.isIncome) {
        budget.incomeCurrent += diff;
      }
    }

    await transaction.save();

    budget.categories[categoryIdx] = category;
    budget.isModified("categories");
    await budget.save();

    return res.status(200).send({ transaction });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports.find = async (req, res) => {
  try {
    const user = req.user;

    if (req.params._id) {
      const transactions = await Transaction.findById(req.params._id);
      return res.status(200).send({ transactions });
    }
    if (!("budgetId" in req.query))
      return res.status(409).send({
        message: `query budgetId is required`,
      });
    const transactions = await Transaction.find({
      userId: user._id,
      budgetId: req.query.budgetId,
    });
    return res.status(200).send({ transactions });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Remove transaction
 *
 * @param {_id: oid}
 */
module.exports.remove = async (req, res) => {
  try {
    if (!("_id" in req.params))
      return res.status(409).send({
        message: `parameter _id is required`,
      });

    const user = req.user;
    const transaction = await Transaction.findById(req.params._id);
    if (!transaction)
      return res.status(404).send({ message: "transaction not found" });

    // if (!transaction.userId.equals(user._id)) return res.status(401).send();

    const budget = await Budget.findById(transaction.budgetId);
    if (!budget)
      return res
        .status(404)
        .send({ message: `budget(${transaction.budgetId}) not found` });

    const categoryIdx = budget.findCategoryIdx(transaction.category.categoryId);
    if (categoryIdx === -1)
      return res.status(404).send({
        message: `category(${transaction.category.categoryId}) not found in budget`,
        transaction,
      });

    const category = budget.categories[categoryIdx];

    // 1. scheduled transaction
    if (!transaction.isCurrent) {
      category.amountScheduled -= transaction.amount;

      // 1-1. expense transaction
      if (transaction.isExpense) {
        budget.expenseScheduled -= transaction.amount;
      }
      // 1-2. income transaction
      else if (transaction.isIncome) {
        budget.incomeScheduled -= transaction.amount;
      }
    }
    // 2. current transaction
    else {
      category.amountCurrent -= transaction.amount;

      // 2-1. expense transaction
      if (transaction.isExpense) {
        budget.expenseCurrent -= transaction.amount;
      }
      // 2-2. income transaction
      else if (transaction.isIncome) {
        budget.incomeCurrent -= transaction.amount;
      }
    }

    await transaction.remove();

    budget.categories[categoryIdx] = category;
    budget.isModified("categories");
    await budget.save();

    if (transaction.linkId) {
      const _transaction = await Transaction.findById(transaction.linkId);
      if (_transaction) {
        _transaction.linkId = undefined;
        _transaction.overAmount = undefined;
        await _transaction.save();
      }
    }
    if (transaction.isCurrent) budget.amountCurrent -= transaction.amount;
    else budget.amountScheduled -= transaction.amount;

    return res.status(200).send();
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
