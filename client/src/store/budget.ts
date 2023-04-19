import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Budget from '../models/Budget';
import { BudgetDataType } from '../util/api/budgetAPI';

const initialState: {
  [id: string]: Budget;
} = {};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setBudgets(state, action: PayloadAction<BudgetDataType[]>) {
      const budgets = action.payload;

      // NOTE: Init state
      for (const item in state) delete state[item];

      budgets.forEach((item) => {
        const budget = Budget.getBudgetFromData(item);
        state[budget.id] = budget;
      });
    },
    setBudget(state, action: PayloadAction<BudgetDataType>) {
      const budgetData: BudgetDataType = action.payload;
      const budget = Budget.getBudgetFromData(budgetData);

      state[budget.id] = budget;
    },
    updateBudget(state, action: PayloadAction<Budget | BudgetDataType>) {
      let budget = action.payload;

      if (!('id' in budget)) {
        budget = Budget.getBudgetFromData(budget);
      }

      state[budget.id] = budget;
    },
  },
});

export const budgetActions = budgetSlice.actions;
export default budgetSlice.reducer;
