import { createSlice } from '@reduxjs/toolkit';
import Budget from '../models/Budget';

const budgets: Budget[] = [];
const budgetSlice = createSlice({
    name: 'budget',
    initialState: budgets,
    reducers: {
        setBudgets(state, action) {
            const budgets = action.payload;
            state.splice(0, state.length); // NOTE: 빈 배열로 초기화

            budgets.forEach((budget: any) => {
                const newBudget = Budget.getBudgetFromData(budget);
                state.push(newBudget);
            });

            state.sort(
                (prev, next) =>
                    +new Date(prev.date.start) - +new Date(next.date.start)
            );
        },
    },
});

export const budgetActions = budgetSlice.actions;
export default budgetSlice.reducer;
