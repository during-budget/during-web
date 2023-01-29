import { createSlice } from '@reduxjs/toolkit';
import Amount from '../models/Amount';

const budgets: {
    id: string;
    title: string;
    isRepeating: boolean;
    startDate: Date;
    endDate: Date;
    total: {
        expense: Amount;
        income: Amount;
    };
}[] = [
    {
        id: 'b1',
        title: '1월 예산',
        isRepeating: true,
        startDate: new Date(2023, 0, 1),
        endDate: new Date(2023, 0, 31),
        total: {
            expense: new Amount(310000, 540000, 820000),
            income: new Amount(0, 0, 0),
        },
    },
    {
        id: 'b12',
        title: '12월 예산',
        isRepeating: true,
        startDate: new Date(2022, 11, 1),
        endDate: new Date(2022, 11, 31),
        total: {
            expense: new Amount(20000, 60000, 300000),
            income: new Amount(0, 0, 0),
        },
    },
];

const budgetSlice = createSlice({
    name: 'budget',
    initialState: budgets,
    reducers: {
        updatePlannedAmount(state, action) {
            const { budgetId, isExpense, amount } = action.payload;
            const budget = state.find((item) => item.id === budgetId);
            if (budget) {
                const key = isExpense ? 'expense' : 'income';
                const total = budget.total[key];
                budget.total[key] = new Amount(
                    total.current,
                    total.scheduled,
                    amount
                );
            }
        },
        updateTotalAmount(state, action) {
            const { budgetId, isExpense, isCurrent, amount } = action.payload;
            const budget = state.find((item) => item.id === budgetId);
            if (budget) {
                const key = isExpense ? 'expense' : 'income';
                budget.total[key] = Amount.getUpdatedAmount(
                    budget.total[key],
                    isCurrent,
                    amount
                );
            }
        },
    },
});

export const budgetActions = budgetSlice.actions;
export default budgetSlice.reducer;
