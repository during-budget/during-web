import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Budget from '../models/Budget';
import { BudgetDataType } from '../util/api/budgetAPI';

const initialState: {
  list: Budget[];
  current: Budget;
  default: Budget;
} = {
  list: [],
  current: Budget.getEmptyBudget(),
  default: Budget.getEmptyBudget(),
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setBudgetList(state, action: PayloadAction<BudgetDataType[]>) {
      const budgets = action.payload;
      state.list = budgets.map((item) => Budget.getBudgetFromData(item));
    },
    addBudgetItem(state, action: PayloadAction<BudgetDataType>) {
      const budget = action.payload;
      state.list.push(Budget.getBudgetFromData(budget));
    },
    setCurrentBudget(state, action: PayloadAction<BudgetDataType>) {
      const budgetData = action.payload;
      state.current = Budget.getBudgetFromData(budgetData);
    },
    setDefaultBudget(state, action: PayloadAction<BudgetDataType>) {
      const budgetData = action.payload;
      state.default = Budget.getBudgetFromData(budgetData);
    },
  },
});

export const budgetActions = budgetSlice.actions;
export default budgetSlice.reducer;
