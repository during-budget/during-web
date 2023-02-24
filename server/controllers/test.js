const Test = require("../models/Test");
const User = require("../models/User");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
// test controller

/**
 * Hello
 *
 * @return message: 'hello world'
 */
module.exports.hello = (req, res) => {
  try {
    return res.status(200).send({ message: "hello world!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * get all data in database
 *
 * @return {users,budgets,transactions}
 */
module.exports.dataList = async (req, res) => {
  try {
    const users = await User.find();
    const budgets = await Budget.find();
    const transactions = await Transaction.find();
    return res.status(200).send({ users, budgets, transactions });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Create and return testData
 *
 * @body {field1: val1, field2: val2}
 * @return testData({_id, data: {field1: val1, field2: val2}})
 */
module.exports.create = async (req, res) => {
  try {
    const testData = new Test({ data: req.body });
    await testData.save();
    return res.status(200).send({ testData });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Find and return testData
 *
 * @params oid
 * @return testData({_id, data: {field1: val1, field2: val2}})
 */
module.exports.find = async (req, res) => {
  try {
    const testData = await Test.findById(req.params._id);
    if (!testData)
      return res.status(404).send({ message: "testData not found" });
    return res.status(200).send({ testData });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update testData
 *
 * @params oid
 * @return testData({_id, data: {field1: val1, field2: val2}})
 */
module.exports.update = async (req, res) => {
  try {
    const testData = await Test.findByIdAndUpdate(
      req.params._id,
      { data: req.body },
      {
        new: true,
      }
    );
    if (!testData)
      return res.status(404).send({ message: "testData not found" });
    return res.status(200).send({ testData });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Remove testData
 *
 * @params oid
 */
module.exports.remove = async (req, res) => {
  try {
    await Test.findByIdAndRemove(req.params._id);
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Read all documents(master)
 */
const model = {
  users: User,
  budgets: Budget,
  transactions: Transaction,
};

module.exports.findDocuments = async (req, res) => {
  try {
    const query = {};
    for (let key of Object.keys(req.query)) {
      if (req.query[key] === "true") query[key] = true;
      else if (req.query[key] === "false") query[key] = false;
      else query[key] = req.query[key];
    }
    console.log(query);
    const documents = await model[req.params.model].find(query);
    return res.status(200).send({ documents });
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};

module.exports.findDocument = async (req, res) => {
  try {
    const document = await model[req.params.model].findById(req.params._id);
    if (!document)
      return res.status(404).send({ message: "document not found" });
    return res.status(200).send({ document });
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};

module.exports.removeDocument = async (req, res) => {
  try {
    await model[req.params.model].findByIdAndRemove(req.params._id);
    return res.status(200).send();
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};

/**
 * Read all users (master)
 */
module.exports.findUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send({ users });
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};
/**
 * Read user (master)
 */
module.exports.findUser = async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    const budgets = await Budget.find({ userId: user._id });
    return res.status(200).send({ user, budgets });
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};

/**
 * Read user (master)
 */
module.exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    const budgets = await Budget.find({ userId: user._id });
    return res.status(200).send({ user, budgets });
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};

/**
 * Read budgets (master)
 */
module.exports.findBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({});
    return res.status(200).send({ budgets });
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};

/**
 * Read budget (master)
 */
module.exports.findBudgetWithTransactions = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params._id);
    if (!budget) return res.status(404).send({ message: "budget not found" });
    const transactions = await Transaction.find({ budgetId: budget._id });
    return res.status(200).send({ budget, transactions });
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};

/**
 * Read transactions (master)
 */
module.exports.findTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      budgetId: req.query.budgetId,
      "category.categoryId": req.query.categoryId,
    });
    return res.status(200).send({ transactions });
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};
