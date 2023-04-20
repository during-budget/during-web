import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Category from '../models/Category';
import { BudgetDataType } from '../util/api/budgetAPI';
import { BudgetCategoryType } from '../util/api/categoryAPI';

const initialState: Category[] = [];

const budgetCategorySlice = createSlice({
  name: 'budget-category',
  initialState,
  reducers: {
    setCategoryFromData(state, action: PayloadAction<BudgetCategoryType[]>) {
      const categories = action.payload;

      // NOTE: Init state
      state.length = 0;

      categories.forEach((item) => {
        const category = Category.getCategoryFromData(item);
        state.push(category);
      });
    },
    updateCategoryAmount(
      state,
      action: PayloadAction<{
        categoryId: string;
        current?: number;
        scheduled?: number;
        planned?: number;
      }>
    ) {
      const { categoryId, current, scheduled, planned } = action.payload;

      const idx = state.findIndex((item) => item.id === categoryId);

      if (state[idx]) {
        state[idx] = Category.getCategoryUpdatedAmount({
          prevCategory: state[idx] as Category,
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
