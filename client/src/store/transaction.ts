import { createSlice } from '@reduxjs/toolkit';
import Transaction from '../models/Transaction';

const initialState: Transaction[] = [];

const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        setTransaction(state, action) {
            state.splice(0, state.length); // NOTE: initialize state
            state.push(...action.payload);
        },
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

            // sort by date (desc)
            state.sort((prev, next) => +next.date - +prev.date);
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
