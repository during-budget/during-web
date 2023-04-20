import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Category from '../models/Category';
import { UserCategoryType } from '../util/api/categoryAPI';

const initialState: Category[] = [];

const categorySlice = createSlice({
  name: 'user-category',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<UserCategoryType[]>) {
      const categories = action.payload;

      // NOTE: Init state
      state.length = 0;

      categories.forEach((data) => {
        const category = Category.getCategoryFromData(data);
        state.push(category);
      });
    },
  },
});

export const categoryActions = categorySlice.actions;
export default categorySlice.reducer;
