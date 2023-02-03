import { createSlice } from '@reduxjs/toolkit';
import Amount from '../models/Amount';
import Budget from '../models/Budget';
import Category from '../models/Category';

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
        categories: categories.map((category: any) => {
            const {
                categoryId: id,
                icon,
                isExpense,
                isIncome,
                title,
                amountCurrent,
                amountPlanned,
                amountScheduled,
            } = category;
            const amount = new Amount(
                amountCurrent,
                amountScheduled,
                amountPlanned
            );
            return new Category({
                id,
                title,
                icon,
                isExpense,
                isIncome,
                amount,
            });
        }),
    });
};

const budgets: Budget[] = [];

const budgetSlice = createSlice({
    name: 'budget',
    initialState: budgets,
    reducers: {
        setBudgets(state, action) {
            const budgets = action.payload;
            state.splice(0, state.length); // NOTE: initialize state
            budgets.forEach((budget: any) => {
                const newBudget = getBudgetFromData(budget);
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

            if (state[idx]) {
                state[idx] = Budget.getBudgetUpdatedTotal(
                    state[idx],
                    isExpense,
                    isCurrent,
                    amount
                );
            }
        },
        updateCategoryPlan(state, action) {
            const { budgetId, categoryId, amount } = action.payload;
            const idx = state.findIndex((item) => item.id === budgetId);

            if (state[idx]) {
                state[idx] = Budget.getBudgetUpdatedCateogryTotal(
                    state[idx],
                    categoryId,
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
                    amount
                )
            }
        }
    },
});

export const budgetActions = budgetSlice.actions;
export default budgetSlice.reducer;
