import { createSlice } from '@reduxjs/toolkit';
import Budget from '../models/Budget';
import Transaction from '../models/Transaction';

const initialState: { budget?: Budget; transactions: Transaction[] } = {
    budget: undefined,
    transactions: [],
};

const basicSlice = createSlice({
    name: 'basic',
    initialState,
    reducers: {
        setBasicBudget(state, action) {
            const budgetData = action.payload;
            state.budget = Budget.getBudgetFromData(budgetData);
        },
        setBasicTransaction(state, action) {
            const transactionsData = action.payload;

            // sort by createAt (desc)
            transactionsData.sort((prev: any, next: any) =>
                new Date(prev.createdAt) < new Date(next.createdAt) ? 1 : -1
            );

            // convert to Trasnaction model
            state.transactions = transactionsData.map((item: any) =>
                Transaction.getTransactionFromData(item)
            );

            // sort by date (desc)
            state.transactions.sort((prev, next) => +next.date - +prev.date);
        },
    },
});

export const basicActions = basicSlice.actions;
export default basicSlice.reducer;
