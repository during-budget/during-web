import { createSlice } from '@reduxjs/toolkit';
import Transaction from '../models/Transaction';

const initialState: {
    data: Transaction[];
    default: Transaction[];
    form: any;
    detail: any;
} = {
    data: [],
    default: [],
    form: {
        mode: {
            isExpand: false,
            isEdit: false,
            isDone: false,
        },
        default: {
            id: '',
            linkId: '',
            isCurrent: true,
            isExpense: true,
            amount: '',
            overAmount: 0,
            categoryId: '',
            date: null,
            icon: '',
            titles: [''],
            tags: [],
            memo: '',
        },
    },
    detail: {
        isOpen: false,
        transaction: null,
        category: '',
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
            form.default = { ...form.default, ...setData.default };
        },
        setTransactions(state, action) {
            const { transactions: transactionData, isDefault } = action.payload;
            transactionData.sort((prev: any, next: any) =>
                new Date(prev.createdAt) < new Date(next.createdAt) ? 1 : -1
            );

            const transactions: Transaction[] = transactionData.map(
                (item: any) => Transaction.getTransactionFromData(item)
            );
            transactions.sort((prev, next) => +next.date - +prev.date); // sort by date (desc)

            if (isDefault) {
                state.default = transactions;
            } else {
                state.data = transactions;
            }
        },
        setBudgetTransactions(state, action) {
            const {
                budgetId,
                transactions: transactionData,
                isDefault,
            } = action.payload;

            const otherTransactions = state.data.filter(
                (item) => item.budgetId !== budgetId
            );

            const transactions = transactionData.map((item: any) => {
                if (item instanceof Transaction) {
                    return item;
                } else {
                    return Transaction.getTransactionFromData(item);
                }
            });

            if (isDefault) {
                state.default = [...transactions, ...otherTransactions];
            } else {
                state.data = [...transactions, ...otherTransactions];
            }
        },
        addTransaction(state, action) {
            const { transaction, isDefault } = action.payload;

            const transactions = isDefault ? state.default : state.data;
            const idx = transactions.findIndex(
                (item) => item.id === transaction.id
            );

            if (idx === -1) {
                transactions.unshift(transaction);
            } else {
                transactions[idx] = transaction;
            }

            transactions.sort((prev, next) => +next.date - +prev.date); // sort by date (desc)
        },
        removeTransaction(state, action) {
            const { id, isDefault } = action.payload;
            const transactions = isDefault ? state.default : state.data;
            const idx = transactions.findIndex((item: any) => item.id === id);
            transactions.splice(idx, 1);
        },
        addLink(state, action) {
            const { targetId, linkId, isDefault } = action.payload;

            const transactions = isDefault ? state.default : state.data;

            const idx = transactions.findIndex((item) => item.id === targetId);

            const target = transactions[idx];

            if (target) {
                target.linkId = linkId;
                transactions[idx] = target;
            }
        },
        removeLink(state, action) {
            const { linkId, isDefault } = action.payload;

            const transactions = isDefault ? state.default : state.data;

            const idx = transactions.findIndex(
                (item: any) => item.id === linkId
            );

            const target = transactions[idx];

            if (target) {
                target.linkId = undefined;
                transactions[idx] = target;
            }
        },
        updateOverAmount(state, action) {
            const { id, amount, isDefault } = action.payload;

            const transactions = isDefault ? state.default : state.data;

            const idx = transactions.findIndex((item: any) => item.id === id);

            const target = transactions[idx];

            if (target) {
                target.overAmount += amount;
                transactions[idx] = target;
            }
        },
        openDetail(state, action) {
            const { transaction, category } = action.payload;
            state.detail = { isOpen: true, transaction, category };
        },
        openLink(state, action) {
            const { id, category, isDefault } = action.payload;

            const transactions = isDefault ? state.default : state.data;

            const transaction = transactions.find((item) => item.id === id);
            state.detail = { isOpen: true, transaction, category };
        },
        closeDetail(state) {
            state.detail.isOpen = false;
        },
    },
});

export const transactionActions = transactionSlice.actions;
export default transactionSlice.reducer;
