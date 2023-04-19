import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const budgetCategorySlice = createSlice({
  name: 'budget-category',
  initialState,
  reducers: {},
});

export const budgetCategoryActions = budgetCategorySlice.actions;
export default budgetCategorySlice.reducer;
