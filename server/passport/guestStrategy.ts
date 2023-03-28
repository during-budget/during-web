import { Request } from "express";
import passport from "passport";
import { Strategy as CustomStrategy } from "passport-custom";
import { Budget } from "../models/Budget";
import { User } from "../models/User";
import { generateRandomString } from "../utils/randomString";

const guest = () => {
  passport.use(
    "guest",
    new CustomStrategy(async function (req: Request, done: any) {
      let email = generateRandomString(8);
      while (true) {
        const exUser = await User.findOne({ email });
        if (exUser) email = generateRandomString(8);
        else break;
      }

      const user = new User({
        email,
        isGuest: true,
      });

      const defaultExpenseCategory = user.findDefaultExpenseCategory();
      const defaultIncomeCategory = user.findDefaultIncomeCategory();

      const budget = new Budget({
        userId: user._id,
        title: "기본 예산",
        categories: [
          {
            ...defaultExpenseCategory,
            categoryId: defaultExpenseCategory._id,
            amountPlanned: 0,
          },
          {
            ...defaultIncomeCategory,
            categoryId: defaultIncomeCategory._id,
            amountPlanned: 0,
          },
        ],
      });

      user.basicBudgetId = budget._id;
      await budget.save();
      await user.save();

      return done(null, user);
    })
  );
};
export { guest };
