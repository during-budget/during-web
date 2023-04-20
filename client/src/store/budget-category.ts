import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Category, { CategoryObjType } from '../models/Category';
import { BudgetDataType } from '../util/api/budgetAPI';
import { BudgetCategoryType } from '../util/api/categoryAPI';

const initialState: CategoryObjType = {};

const budgetCategorySlice = createSlice({
  name: 'budget-category',
  initialState,
  reducers: {
    setCategoryFromBudgetData(state, action: PayloadAction<BudgetDataType>) {
      const budgetData = action.payload;

      budgetData.categories.forEach((item) => {
        const category = Category.getCategoryFromData(item);
        state[category.id] = category;
      });
    },
    setCategoryFromData(state, action: PayloadAction<BudgetCategoryType[]>) {
      const categoryData = action.payload;

      categoryData.forEach((data) => {
        const newCategory = Category.getCategoryFromData(data);
        state[newCategory.id] = newCategory;
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

      state[categoryId] = Category.getCategoryUpdatedAmount({
        prevCategory: state[categoryId] as Category,
        current,
        scheduled,
        planned,
      });
    },
  },
});

export const budgetCategoryActions = budgetCategorySlice.actions;
export default budgetCategorySlice.reducer;
