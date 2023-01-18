import { createSlice } from '@reduxjs/toolkit';
import Transaction from '../models/Transaction';

const initialState: Transaction[] = [
    new Transaction({
        id: 't1',
        budgetId: 'b1',
        isCurrent: false,
        isExpense: true,
        title: ['Title1', 'Title2'],
        date: new Date(),
        amount: 60000,
        categoryId: 'c1',
    }),
    new Transaction({
        id: 't2',
        budgetId: 'b1',
        isCurrent: true,
        isExpense: true,
        title: ['Title', 'SubTitle'],
        date: new Date(),
        amount: 20000,
        categoryId: 'c1',
    }),
];

const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        addTransaction(state, action) {
            const transaction = action.payload;
            state.push(transaction);
        },
    },
});

export const transactionActions = transactionSlice.actions;
export default transactionSlice.reducer;
