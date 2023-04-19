import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Amount from '../models/Amount';
import { BudgetDataType } from '../util/api/budgetAPI';
import { getExpenseKey } from '../util/key';

export interface TotalType {
  expense: Amount;
  income: Amount;
}

const initialState: TotalType = {
  expense: new Amount(0, 0, 0),
  income: new Amount(0, 0, 0),
};

const totalSlice = createSlice({
  name: 'total',
  initialState,
  reducers: {
    setTotalFromBudgetData(state, action: PayloadAction<BudgetDataType>) {
      const {
        expenseCurrent,
        expenseScheduled,
        expensePlanned,
        incomeCurrent,
        incomeScheduled,
        incomePlanned,
      } = action.payload;

      state.expense = new Amount(
        expenseCurrent,
        expenseScheduled,
        expensePlanned
      );
      state.income = new Amount(incomeCurrent, incomeScheduled, incomePlanned);
    },
    updateTotalAmount(
      state,
      action: PayloadAction<{
        isExpense: boolean;
        current?: number;
        scheduled?: number;
        planned?: number;
      }>
    ) {
      const { isExpense, current, scheduled, planned } = action.payload;

      const key = getExpenseKey(isExpense);

      const {
        current: prevCurrent,
        scheduled: prevScheduled,
        planned: prevPlanned,
      } = state[key];

      state[key] = new Amount(
        current !== undefined ? current + prevCurrent : prevCurrent,
        scheduled !== undefined ? scheduled + prevScheduled : prevScheduled,
        planned !== undefined ? planned : prevPlanned
      );
    },
  },
});

export const totalActions = totalSlice.actions;
export default totalSlice.reducer;
