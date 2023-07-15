import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Category from '../models/Category';
import { UserCategoryType } from '../util/api/categoryAPI';

const initialState: { income: Category[]; expense: Category[] } = {
  income: [],
  expense: [],
};

const categorySlice = createSlice({
  name: 'user-category',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<UserCategoryType[]>) {
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
    addCategory(state, action: PayloadAction<UserCategoryType>) {
      const category = Category.getCategoryFromData(action.payload);
      if (category.isExpense) {
        state.expense = [...state.expense, category];
      } else {
        state.income = [...state.income, category];
      }
    },
  },
});

export const userCategoryActions = categorySlice.actions;
export default categorySlice.reducer;
