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
        budgetId: 'b2',
        isCurrent: false,
        isExpense: true,
        title: ['Budget2', 'Title2'],
        date: new Date(),
        amount: 60000,
        categoryId: 'c1',
    }),
    new Transaction({
        id: 't3',
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

            // NOTE: filtering empty title string
            const titles = transaction.title.filter((item: any) => item);
            transaction.title = titles;

            const idx = state.findIndex((item) => item.id === transaction.id);

            if (idx === -1) {
                state.push(transaction);
            } else {
                state[idx] = transaction;
            }
        },
        removeTransaction(state, action) {
            const id = action.payload;
            const idx = state.findIndex((item: any) => item.id === id);
            state.splice(idx, 1);
        },
        addLink(state, action) {
            const { targetId, linkId } = action.payload;
            const target = state.find((item) => item.id === targetId);
            if (target) {
                target.linkId = linkId;
            }
        },
    },
});

export const transactionActions = transactionSlice.actions;
export default transactionSlice.reducer;
