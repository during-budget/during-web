import { createSlice } from '@reduxjs/toolkit';
import Amount from '../models/Amount';

const budgets: {
    id: string;
    title: string;
    isRepeating: boolean;
    startDate: Date;
    endDate: Date;
    total: Amount;
}[] = [
    {
        id: 'b1',
        title: '1월 예산',
        isRepeating: true,
        startDate: new Date(2023, 0, 1),
        endDate: new Date(2023, 0, 31),
        total: new Amount(20000, 60000, 300000),
    },
];

const budgetSlice = createSlice({
    name: 'budget',
    initialState: budgets,
    reducers: {
        replaceTotalAmount(state, action) {
            const { budgetId, amount } = action.payload;
            const budget = state.find((item) => item.id === budgetId);
            if (budget) {
                budget.total = amount;
            }
        },
        updateTotalAmount(state, action) {
            const { budgetId, isCurrent, amount } = action.payload;
            const budget = state.find((item) => item.id === budgetId);
            if (budget) {
                budget.total = Amount.getUpdatedAmount(
                    budget.total,
                    isCurrent,
                    amount
                );
            }
        },
    },
});

export const budgetActions = budgetSlice.actions;
export default budgetSlice.reducer;
