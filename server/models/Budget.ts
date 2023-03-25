import { Schema, model, Model, Types, HydratedDocument } from "mongoose";
import _ from "lodash";

interface ICategory {
  categoryId: Types.ObjectId;
  isExpense?: boolean;
  isIncome?: boolean;
  isDefault?: boolean;
  title: string;
  icon: string;
  amountScheduled: number;
  amountCurrent: number;
  amountPlanned: number;
}

const categorySchema = new Schema<ICategory>(
  {
    categoryId: Schema.Types.ObjectId,
    isExpense: { type: Boolean, default: false },
    isIncome: { type: Boolean, default: false },
    isDefault: { type: Boolean, default: false },
    title: String,
    icon: String,
    amountScheduled: {
      type: Number,
      default: 0,
    },
    amountCurrent: {
      type: Number,
      default: 0,
    },
    amountPlanned: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

interface IBudget {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  title: string;
  expenseScheduled: number;
  expenseCurrent: number;
  expensePlanned: number;
  incomeScheduled: number;
  incomeCurrent: number;
  incomePlanned: number;
  categories: ICategory[];
}

interface IBudgetProps {
  /* subdocument array */
  categories: Types.DocumentArray<ICategory>;
  /* methods */
  findCategory: (
    categoryId: string | Types.ObjectId
  ) => HydratedDocument<ICategory> | undefined;
  findCategoryIdx: (categoryId: string | Types.ObjectId) => number;
  pushCategory: (category: any) => void;
  addDefaultCategory: (isExpense: boolean, amount: number) => void;
}

interface BudgetModelType extends Model<IBudget, {}, IBudgetProps> {}

const budgetSchema = new Schema<IBudget, BudgetModelType, IBudgetProps>(
  {
    userId: Schema.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    title: String,

    //예정 지출
    expenseScheduled: {
      type: Number,
      default: 0,
    },

    //현재 지출
    expenseCurrent: {
      type: Number,
      default: 0,
    },

    //지출 예산 총액
    expensePlanned: {
      type: Number,
      default: 0,
    },

    //예정 수입
    incomeScheduled: {
      type: Number,
      default: 0,
    },

    //현재 수입
    incomeCurrent: {
      type: Number,
      default: 0,
    },

    //수입 예산 총액

    incomePlanned: {
      type: Number,
      default: 0,
    },

    categories: [categorySchema],
  },
  { timestamps: true }
);

budgetSchema.index({
  user: 1,
  startDate: -1,
});

budgetSchema.methods.findCategory = function (
  categoryId: string | Types.ObjectId
) {
  return _.find(this.categories, {
    categoryId: new Types.ObjectId(categoryId),
  })?.toObject();
};

budgetSchema.methods.findCategoryIdx = function (
  categoryId: string | Types.ObjectId
) {
  return _.findIndex(this.categories, {
    categoryId: new Types.ObjectId(categoryId),
  });
};

budgetSchema.methods.pushCategory = function (category: any) {
  this.categories.splice(this.categories.length - 2, 0, category);
  return;
};

budgetSchema.methods.addDefaultCategory = function (isExpense, amount) {
  const idx = this.categories.length - (isExpense ? 2 : 1);
  this.categories[idx].amountPlanned =
    (this.categories[idx].amountPlanned ?? 0) + amount;
  return;
};

const Budget = model<IBudget, BudgetModelType>("Budget", budgetSchema);
export { Budget, IBudget, BudgetModelType };