import { createSlice } from '@reduxjs/toolkit';
import Transaction from '../models/Transaction';

const initialState: { data: Transaction[]; form: any } = {
    data: [],
    form: {
        mode: {
            isExpand: false,
            isEdit: false,
            isCompleted: false,
        },
        default: {
            id: '',
            linkId: '',
            isCurrent: true,
            isExpense: true,
            amount: '',
            linkAmount: '',
            categoryId: '',
            date: null,
            icon: '',
            titles: [''],
            tags: [''],
            memo: '',
        },
    },
};

const transactionSlice = createSlice({
    initialState,
    name: 'transaction',
    reducers: {
        clearForm(state) {
            state.form = initialState.form;
        },
        setForm(state, action) {
            const setData = action.payload;
            const form = state.form;
            form.mode = { ...form.mode, ...setData.mode };
            form.value = { ...form.value, ...setData.value };
        },
        setTransaction(state, action) {
            const transactions = action.payload;
            state.data = transactions.map((item: any) =>
                Transaction.getTransactionFromData(item)
            );
        },
        addTransaction(state, action) {
            const data = state.data;
            const transaction = action.payload;

            const idx = data.findIndex((item) => item.id === transaction.id);

            if (idx === -1) {
                data.push(transaction);
            } else {
                data[idx] = transaction;
            }

            data.sort((prev, next) => +next.date - +prev.date); // sort by date (desc)
            // state.data = data; // 필요할까?
        },
        removeTransaction(state, action) {
            const data = state.data;
            const id = action.payload;
            const idx = data.findIndex((item: any) => item.id === id);
            data.splice(idx, 1);
        },
        removeLink(state, action) {},
        addLink(state, action) {},
    },
});

export const transactionActions = transactionSlice.actions;
export default transactionSlice.reducer;
