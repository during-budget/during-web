const _ = require("lodash");
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

// transaction controller

/**
 * Create transaction
 *
 * @body { budgetId, date, isCurrent, isExpense: Boolean, title: [String], ammount: Number, categoryId, tags?, memo?}
 * @return transaction
 */
module.exports.create = async (req, res) => {
  try {
    const user = req.user;

    const category = _.find(user.categories, {
      _id: mongoose.Types.ObjectId(req.body.categoryId),
    });
    if (!category)
      return res
        .status(404)
        .send({ message: `category(${req.body.categoryId}) not found` });

    const transaction = new Transaction({
      userId: req.user._id,
      budgetId: req.body.budgetId,
      date: req.body.date,
      isCurrent: req.body.isCurrent,
      isExpense: category.isExpense,
      title: req.body.title,
      ammount: req.body.ammount,
      category: {
        categoryId: category._id,
        title: category.title,
        icon: category.icon,
      },
      tags: req.body.tags ?? [],
      memo: req.body.memo ?? "",
    });
    await transaction.save();
    return res.status(200).send(transaction);
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
    const user = req.user;
    const transaction = await Transaction.findById(req.params._id);
    if (!transaction) return res.status(404).send();
    if (!transaction.userId.equals(user._id)) return res.status(401).send();

    const category = _.find(user.categories, {
      _id: mongoose.Types.ObjectId(req.body.categoryId),
    });
    if (!category) return res.status(404).send();

    transaction.isExpense = category.isExpense;
    transaction.category = {
      ...category,
      categoryId: category._id,
    };
    await transaction.save();

    return res.status(200).send({ transaction });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update transaction category
 *
 * @param {_id: transactionId}
 * @body { date?, title?, ammount?, tags?, memo? }
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
    transaction.ammount = req.body.ammount ?? transaction.ammount;
    transaction.tags = req.body.tags ?? transaction.tags;
    transaction.memo = req.body.memo ?? transaction.memo;
    await transaction.save();

    return res.status(200).send({ transaction });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports.find = async (req, res) => {
  try {
    const user = req.user;

    if (req.query._id) {
      const transactions = await Transaction.findById(req.query._id);
      return res.status(200).send({ transactions });
    }
    const transactions = await Transaction.find({ userId: user._id });
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
    const user = req.user;
    const transaction = await Transaction.findById(req.params._id);
    if (!transaction) return res.status(404).send();
    if (!transaction.userId.equals(user._id)) return res.status(401).send();
    await transaction.remove();
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
