import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Budget } from "../models/Budget";
import { User } from "../models/User";
import { client } from "../redis";
import { decipher } from "../utils/crypto";

const register = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "code",
      },
      async function (email: string, code: string, done: any) {
        const _code = await client.v4.hGet(email, "code");
        if (!_code) {
          const err = new Error("Verification code is expired");
          err.status = 404;
          return done(err, null, null);
        }

        if (decipher(_code) !== code) {
          const err = new Error("Verification code is wrong");
          err.status = 409;
          return done(err, null, null);
        }

        const user = new User({
          email,
        });
        user.setDefaultCategories();

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
        await client.del(email);

        return done(null, user);
      }
    )
  );
};
export { register };
