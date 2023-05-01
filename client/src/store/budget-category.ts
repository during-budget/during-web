import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Category from '../models/Category';
import { BudgetCategoryType, UserCategoryType } from '../util/api/categoryAPI';

const initialState: { income: Category[]; expense: Category[] } = {
  income: [],
  expense: [],
};

const budgetCategorySlice = createSlice({
  name: 'budget-category',
  initialState,
  reducers: {
    setCategoryFromData(state, action: PayloadAction<BudgetCategoryType[]>) {
      const categories = action.payload;

      // NOTE: Init state
      state.income.length = 0;
      state.expense.length = 0;

      categories.forEach((item) => {
        const category = Category.getCategoryFromData(item);
        if (category.isExpense) {
          state.expense.push(category);
        } else {
          state.income.push(category);
        }
      });
    },
    updateCategory(
      state,
      action: PayloadAction<{ isExpense: boolean; categories: Category[] }>
    ) {
      const { isExpense, categories } = action.payload;
      const key = isExpense ? 'expense' : 'income';
      state[key] = categories;
    },
    updateCategoryFromSetting(
      state,
      action: PayloadAction<{
        updated: UserCategoryType[];
        removed: UserCategoryType[];
      }>
    ) {
      const { updated, removed } = action.payload;

      // updated - id -> change title, icon
      const updatingObj = new Map<string, { title: string; icon: string }>();
      updated.forEach((item) => {
        const { title, icon } = item;
        updatingObj.set(item._id, { title, icon });
      });

      // removed - id -> remove
      const removingId = removed.map((item) => item._id);

      // update state - get removing idx & update data & remove data
      const removingIdx: number[] = [];

      for (const i in state) {
        const key = i === 'income' ? 'income' : 'expense';

        state[key].forEach((item, i) => {
          const isRemoved = removingId.includes(item.id);
          const updatingData = updatingObj.get(item.id);

          if (isRemoved) {
            removingIdx.push(i);
          }

          if (updatingData) {
            state[key][i].title = updatingData.title;
            state[key][i].icon = updatingData.icon;
          }
        });

        removingIdx.forEach((idx) => {
          state[key].splice(idx, 1);
        });
      }
    },
    updateCategoryAmount(
      state,
      action: PayloadAction<{
        categoryId: string;
        isExpense: boolean;
        current?: number;
        scheduled?: number;
        planned?: number;
      }>
    ) {
      const { categoryId, current, isExpense, scheduled, planned } = action.payload;

      const key = isExpense ? 'expense' : 'income';
      const idx = state[key].findIndex((item) => item.id === categoryId);

      if (state[key][idx]) {
        state[key][idx] = Category.getCategoryUpdatedAmount({
          prevCategory: state[key][idx] as Category,
          current,
          scheduled,
          planned,
        });
      }
    },
  },
});

export const budgetCategoryActions = budgetCategorySlice.actions;
export default budgetCategorySlice.reducer;
