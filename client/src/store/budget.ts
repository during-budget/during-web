import { createSlice } from '@reduxjs/toolkit';
import Budget from '../models/Budget';

const initialState: Budget[] = [];

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        setBudgets(state, action) {
            const data = action.payload;
            const budgets = data.map((item: any) =>
                Budget.getBudgetFromData(item)
            );

            state.push(...budgets);
            state.sort(
                (prev, next) =>
                    +new Date(prev.date.start) - +new Date(next.date.start)
            );
        },
        updateTotalAmount(state, action) {
            const { budgetId, isExpense, isCurrent, amount } = action.payload;
            const idx = state.findIndex((item) => item.id === budgetId);

            if (state[idx]) {
                state[idx] = Budget.getBudgetUpdatedTotalAmount(
                    state[idx],
                    isExpense,
                    isCurrent,
                    amount
                );
            }
        },
        updateCategoryAmount(state, action) {
            const { budgetId, categoryId, isCurrent, amount } = action.payload;
            const idx = state.findIndex((item) => item.id === budgetId);

            if (state[idx]) {
                state[idx] = Budget.getBudgetUpdatedCategoryAmount(
                    state[idx],
                    categoryId,
                    isCurrent,
                    +amount
                );
            }
        },
        updateTotalPlan(state, action) {
            const { budgetId, isExpense, amount } = action.payload;
            const idx = state.findIndex((item) => item.id === budgetId);
            if (state[idx]) {
                state[idx] = Budget.getBudgetUpdatedPlan(
                    state[idx],
                    isExpense,
                    amount
                );
            }
        },
        updateCategoryPlan(state, action) {
            const { budgetId, categoryId, amount } = action.payload;
            const idx = state.findIndex((item) => item.id === budgetId);
            console.log(state[idx]);
            if (state[idx]) {
                state[idx] = Budget.getBudgetUpdatedCategoryPlan(
                    state[idx],
                    categoryId,
                    amount
                );
                console.log(state[idx]);
            }
        },
    },
});

export const budgetActions = budgetSlice.actions;
export default budgetSlice.reducer;
