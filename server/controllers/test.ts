import { Request, Response } from "express";
import { Test } from "../models/Test";
import { User, IUser, IUserModel } from "../models/User";
import { Budget, BudgetModelType, IBudget } from "../models/Budget";
import { Transaction, ITransaction } from "../models/Transaction";
import nodeMailer from "nodemailer";
import { Model } from "mongoose";

// test controller

const sendMail = async () => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const mailOptions = {
    from: "During Team",
    to: process.env.NODEMAILER_TO,
    subject: "가입 인증 메일",
    html: `
      가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
      <form action="#" method="POST">
        <button>가입확인</button>
      </form>  
      `,
  };
  await transporter.sendMail(mailOptions);
};

/**
 * Hello
 *
 * @return message: 'hello world'
 */
export const hello = async (req: Request, res: Response) => {
  try {
    await sendMail();
    return res.status(200).send({ message: "hello world!" });
  } catch (err: any) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * get all data in database
 *
 * @return {users,budgets,transactions}
 */
export const dataList = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    const budgets = await Budget.find();
    const transactions = await Transaction.find();
    return res.status(200).send({ users, budgets, transactions });
  } catch (err: any) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Create and return testData
 *
 * @body {field1: val1, field2: val2}
 * @return testData({_id, data: {field1: val1, field2: val2}})
 */
export const create = async (req: Request, res: Response) => {
  try {
    const testData = new Test({ data: req.body });
    await testData.save();
    return res.status(200).send({ testData });
  } catch (err: any) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Find and return testData
 *
 * @params oid
 * @return testData({_id, data: {field1: val1, field2: val2}})
 */
export const find = async (req: Request, res: Response) => {
  try {
    const testData = await Test.findById(req.params._id);
    if (!testData)
      return res.status(404).send({ message: "testData not found" });
    return res.status(200).send({ testData });
  } catch (err: any) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Update testData
 *
 * @params oid
 * @return testData({_id, data: {field1: val1, field2: val2}})
 */
export const update = async (req: Request, res: Response) => {
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
  } catch (err: any) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Remove testData
 *
 * @params oid
 */
export const remove = async (req: Request, res: Response) => {
  try {
    await Test.findByIdAndRemove(req.params._id);
    return res.status(200).send();
  } catch (err: any) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Read all documents(master)
 */
const model = (
  _model: string
): IUserModel | BudgetModelType | Model<ITransaction> => {
  if (_model === "users") return User;
  if (_model === "budgets") return Budget;
  return Transaction;
};

export const findDocuments = async (req: Request, res: Response) => {
  try {
    const query: { [key: string]: boolean | string } = {};
    for (let key of Object.keys(req.query)) {
      if (req.query[key] === "true") query[key] = true;
      else if (req.query[key] === "false") query[key] = false;
      else query[key] = req.query[key]?.toString()!;
    }
    let documents = [];
    if (req.params.model === "users") documents = await User.find(query);
    else if (req.params.model === "budgets")
      documents = await Budget.find(query);
    else documents = await Transaction.find(query);

    return res.status(200).send({ documents });
  } catch (err: any) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};

export const findDocument = async (req: Request, res: Response) => {
  try {
    let document = undefined;
    if (req.params.model === "users")
      document = await User.findById(req.params._id);
    else if (req.params.model === "budgets")
      document = await Budget.findById(req.params._id);
    else document = await Transaction.findById(req.params._id);

    if (!document)
      return res.status(404).send({ message: "document not found" });
    return res.status(200).send({ document });
  } catch (err: any) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    await Transaction.deleteMany({ userId: req.params._id });
    await Budget.deleteMany({ userId: req.params._id });
    await User.findByIdAndRemove(req.params._id);
    return res.status(200).send();
  } catch (err: any) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};
export const removeBudget = async (req: Request, res: Response) => {
  try {
    await Transaction.deleteMany({ userId: req.params._id });
    await Budget.findByIdAndRemove(req.params._id);
    return res.status(200).send();
  } catch (err: any) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};

/**
 * Read all users (master)
 */
export const findUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(200).send({ users });
  } catch (err: any) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};
/**
 * Read user (master)
 */
export const findUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params._id);
    if (!user) return res.status(404).send({});
    const budgets = await Budget.find({ userId: user._id });
    return res.status(200).send({ user, budgets });
  } catch (err: any) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};

/**
 * Read user (master)
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params._id);
    if (!user) return res.status(404).send({});
    const budgets = await Budget.find({ userId: user._id });
    return res.status(200).send({ user, budgets });
  } catch (err: any) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};

/**
 * Read budgets (master)
 */
export const findBudgets = async (req: Request, res: Response) => {
  try {
    const budgets = await Budget.find({});
    return res.status(200).send({ budgets });
  } catch (err: any) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};

/**
 * Read budget (master)
 */
export const findBudgetWithTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const budget = await Budget.findById(req.params._id);
    if (!budget) return res.status(404).send({ message: "budget not found" });
    const transactions = await Transaction.find({ budgetId: budget._id });
    return res.status(200).send({ budget, transactions });
  } catch (err: any) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};

/**
 * Read transactions (master)
 */
export const findTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find({
      budgetId: req.query.budgetId,
      "category.categoryId": req.query.categoryId,
    });
    return res.status(200).send({ transactions });
  } catch (err: any) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};
