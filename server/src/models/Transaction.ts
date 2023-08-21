import { Schema, model, Model, Types } from "mongoose";

interface ICategory {
  categoryId: Types.ObjectId;
  isExpense?: boolean;
  isIncome?: boolean;
  title: string;
  icon: string;
}

const categorySchema = new Schema<ICategory>(
  {
    categoryId: Schema.Types.ObjectId,
    isExpense: { type: Boolean, default: false },
    isIncome: { type: Boolean, default: false },
    title: String,
    icon: String,
  },
  { _id: false }
);

interface ITransaction {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  budgetId: Types.ObjectId;
  date: Date;
  isCurrent: boolean;
  isExpense?: boolean;
  isIncome?: boolean;
  linkId?: Types.ObjectId;
  icon: string;
  title: [string];
  amount: number;
  overAmount?: number;
  category: ICategory;
  tags: [string];
  memo: string;
  linkedPaymentMethodId?: Types.ObjectId;
  linkedPaymentMethodType?: "asset" | "card";
  linkedPaymentMethodIcon?: string;
  linkedPaymentMethodTitle?: string;
  linkedPaymentMethodDetail?: string;
  updateAsset: boolean;
  year?: number;
  month?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: Schema.Types.ObjectId,
    budgetId: Schema.Types.ObjectId,
    date: Date,
    isCurrent: Boolean, // true - current, false - scheduled
    isExpense: { type: Boolean, default: false },
    isIncome: { type: Boolean, default: false },
    linkId: Schema.Types.ObjectId, // isCurrent - scheduledId, !isCurrent - currentId
    icon: { type: String, default: "" },
    title: [String],
    amount: Number,
    overAmount: Number,
    category: categorySchema, // category of budget
    tags: [String],
    memo: {
      type: String,
      default: "",
    },
    linkedPaymentMethodId: Schema.Types.ObjectId,
    linkedPaymentMethodType: String,
    linkedPaymentMethodIcon: String,
    linkedPaymentMethodTitle: String,
    linkedPaymentMethodDetail: String,
    updateAsset: { type: Boolean, default: true },
    year: Number,
    month: Number,
  },
  { timestamps: true }
);

transactionSchema.index({
  user: 1,
  Date: -1,
});

const Transaction = model<ITransaction>("Transaction", transactionSchema);
export { Transaction, ITransaction };
