import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Category from '../models/Category';
import {
  TransactionDataType,
  TransactionType,
  convertTransactionFromData,
} from '../util/api/transactionAPI';

interface TransactionFormType {
  mode: TransactionModeType;
  default: TransactionType;
}
interface TransactionDetailType {
  isOpen: boolean;
  transaction?: TransactionType;
  category?: Category;
}

interface TransactionModeType {
  isExpand: boolean;
  isEdit: boolean;
  isDone: boolean;
}
interface TransactionFormPayloadType {
  mode: Partial<TransactionModeType>;
  default: Partial<TransactionType>;
}

const initialState: {
  data: TransactionType[];
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
      _id: '',
      budgetId: '',
      isCurrent: true,
      isExpense: true,
      amount: 0,
      categoryId: '',
      date: null, // yyyy-mm-dd
      icon: '',
      title: [''],
      tags: [],
      memo: '',
      linkId: '',
      overAmount: 0,
      updateAsset: true,
      updateBudget: true,
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
      const transactions: TransactionType[] = transactionData.map((item) =>
        convertTransactionFromData(item)
      );

      // sort by date
      sortTransactionDesc(transactions); // sort by date (desc)

      state.data = transactions;
    },
    addTransactionFromData(state, action: PayloadAction<TransactionDataType>) {
      const transaction = action.payload;

      const transactions = state.data;

      transactions.unshift(convertTransactionFromData(transaction));
      sortTransactionDesc(transactions);
    },
    removeTransaction(state, action: PayloadAction<string>) {
      const id = action.payload;

      const idx = state.data.findIndex((item) => item._id === id);
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

      const idx = state.data.findIndex((item) => item._id === id);
      state.data[idx] = convertTransactionFromData(transactionData);

      sortTransactionDesc(state.data);
    },
    replaceTransactionFromData(state, action: PayloadAction<TransactionDataType>) {
      const data = action.payload;

      if (!data) {
        return;
      }

      const idx = state.data.findIndex((item) => item._id === data._id);

      state.data[idx] = convertTransactionFromData(data);
    },
    openDetail(
      state,
      action: PayloadAction<{
        transaction: TransactionType;
        category: Category;
      }>
    ) {
      const { transaction, category } = action.payload;
      state.detail = { isOpen: true, transaction, category };
    },
    openLink(state, action: PayloadAction<{ id: string; category: Category }>) {
      const { id, category } = action.payload;

      const transactions = state.data;

      const transaction = transactions.find((item) => item._id === id);
      state.detail = { isOpen: true, transaction, category };
    },
    closeDetail(state) {
      state.detail.isOpen = false;
    },
  },
});

const sortTransactionDesc = (transactions: TransactionType[]) => {
  transactions.sort((prev, next) => {
    if (prev.date && next.date) {
      return +next.date - +prev.date;
    } else if (next.date) {
      return 1;
    } else if (prev.date) {
      return -1;
    } else {
      return 0;
    }
  });
};

export const transactionActions = transactionSlice.actions;
export default transactionSlice.reducer;
