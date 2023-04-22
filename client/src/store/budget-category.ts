import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Category from '../models/Category';
import { BudgetCategoryType, UserCategoryType } from '../util/api/categoryAPI';

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

      state.forEach((item, i) => {
        const isRemoved = removingId.includes(item.id);
        const updatingData = updatingObj.get(item.id);

        if (isRemoved) {
          removingIdx.push(i);
        }

        if (updatingData) {
          state[i].title = updatingData.title;
          state[i].icon = updatingData.icon;
        }
      });

      removingIdx.forEach((idx) => {
        state.splice(idx, 1);
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
