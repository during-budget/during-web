import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import { TransactionDataType } from '../util/api/transactionAPI';

interface TransactionFormType {
  mode: TransactionModeType;
  default: TransactionDefaultType;
}
interface TransactionDetailType {
  isOpen: boolean;
  transaction?: Transaction;
  category?: Category;
}

interface TransactionModeType {
  isExpand: boolean;
  isEdit: boolean;
  isDone: boolean;
}
export interface TransactionDefaultType {
  id: string;
  linkId?: string;
  isCurrent: boolean;
  isExpense: boolean;
  amount: number;
  overAmount: number;
  categoryId: string;
  date: string;
  icon: string;
  titles: string[];
  tags: string[];
  memo: string;
}
interface TransactionFormPayloadType {
  mode: Partial<TransactionModeType>;
  default: Partial<TransactionDefaultType>;
}

const initialState: {
  data: Transaction[];
  form: TransactionFormType;
  detail: TransactionDetailType;
} = {
  data: [],
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
      amount: 0,
      overAmount: 0,
      categoryId: '',
      date: '', // yyyy-mm-dd
      icon: '',
      titles: [''],
      tags: [],
      memo: '',
    },
  },
  detail: {
    isOpen: false,
    transaction: undefined,
    category: undefined,
  },
};

const transactionSlice = createSlice({
  initialState,
  name: 'transaction',
  reducers: {
    clearForm(state) {
      state.form = initialState.form;
    },
    setForm(state, action: PayloadAction<TransactionFormPayloadType>) {
      const setData = action.payload;
      const form = state.form;
      form.mode = { ...form.mode, ...setData.mode };
      form.default = { ...form.default, ...setData.default };
    },
    setTransactions(state, action: PayloadAction<TransactionDataType[]>) {
      const transactionData = action.payload;

      // sort by created (desc)
      transactionData.sort((prev: any, next: any) =>
        new Date(prev.createdAt) < new Date(next.createdAt) ? 1 : -1
      );

      // convert
      const transactions: Transaction[] = transactionData.map((item: any) =>
        Transaction.getTransactionFromData(item)
      );

      // sort by date
      transactions.sort((prev, next) => +next.date - +prev.date); // sort by date (desc)

      state.data = transactions;
    },
    addTransaction(state, action: PayloadAction<Transaction>) {
      const transaction = action.payload;

      const transactions = state.data;

      transactions.unshift(transaction);
      transactions.sort((prev, next) => +next.date - +prev.date); // sort by date (desc)
    },
    removeTransaction(state, action: PayloadAction<string>) {
      const id = action.payload;

      const idx = state.data.findIndex((item: any) => item.id === id);
      state.data.splice(idx, 1);
    },
    updateTransactionFromData(
      state,
      action: PayloadAction<{
        id: string;
        transactionData: TransactionDataType;
      }>
    ) {
      const { id, transactionData } = action.payload;

      const idx = state.data.findIndex((item) => item.id === id);
      state.data[idx] = Transaction.getTransactionFromData(transactionData);

      state.data.sort((prev, next) => +next.date - +prev.date); // sort by date (desc)
    },
    addLink(state, action: PayloadAction<{ targetId: string; linkId: string }>) {
      const { targetId, linkId } = action.payload;

      const transactions = state.data;

      const idx = transactions.findIndex((item) => item.id === targetId);
      const target = transactions[idx];

      if (target) {
        target.linkId = linkId;
        transactions[idx] = target;
      }
    },
    removeLink(state, action: PayloadAction<string>) {
      const linkId = action.payload;

      const transactions = state.data;
      const idx = transactions.findIndex((item: any) => item.id === linkId);

      const target = transactions[idx];

      if (target) {
        target.linkId = undefined;
        transactions[idx] = target;
      }
    },
    updateOverAmount(state, action: PayloadAction<{ id: string; amount: number }>) {
      const { id, amount } = action.payload;

      const transactions = state.data;
      const idx = transactions.findIndex((item: any) => item.id === id);

      const target = transactions[idx];

      if (target) {
        target.overAmount += amount;
        transactions[idx] = target;
      }
    },
    openDetail(
      state,
      action: PayloadAction<{
        transaction: Transaction;
        category: Category;
      }>
    ) {
      const { transaction, category } = action.payload;
      state.detail = { isOpen: true, transaction, category };
    },
    openLink(state, action: PayloadAction<{ id: string; category: Category }>) {
      const { id, category } = action.payload;

      const transactions = state.data;

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
