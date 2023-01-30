import { createSlice } from '@reduxjs/toolkit';
import Amount from '../models/Amount';
import Budget from '../models/Budget';

const getBudgetFromData = (budget: any) => {
    const {
        _id: id,
        title,
        startDate,
        endDate,
        expenseCurrent,
        expenseScheduled,
        expensePlanned,
        incomeCurrent,
        incomeScheduled,
        incomePlanned,
        categories,
    } = budget;
    return new Budget({
        id,
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        total: {
            expense: new Amount(
                expenseCurrent,
                expenseScheduled,
                expensePlanned
            ),
            income: new Amount(incomeCurrent, incomeScheduled, incomePlanned),
        },
        categories,
    });
};

const budgets: Budget[] = [];

const budgetSlice = createSlice({
    name: 'budget',
    initialState: budgets,
    reducers: {
        setBudgets(state, action) {
            const budgets = action.payload;
            budgets.forEach((budget: any) => {
                const newBudget = getBudgetFromData(budget);
                state.splice(0, state.length); // initialize state
                state.push(newBudget);
            });
        },
        addBudget(state, action) {
            const budget = action.payload;
            const newBudget = getBudgetFromData(budget);
            state.push(newBudget);
            state.sort(
                (prev, next) =>
                    +new Date(prev.startDate) - +new Date(next.startDate)
            );
        },
        updatePlannedAmount(state, action) {
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
        updateTotalAmount(state, action) {
            const { budgetId, isExpense, isCurrent, amount } = action.payload;
            const idx = state.findIndex((item) => item.id === budgetId);

            console.log(state[idx]);
            if (state[idx]) {
                state[idx] = Budget.getBudgetUpdatedTotal(
                    state[idx],
                    isExpense,
                    isCurrent,
                    amount
                );
            }
        },
    },
});

export const budgetActions = budgetSlice.actions;
export default budgetSlice.reducer;
