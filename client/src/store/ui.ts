import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  budget: {
    isCurrent: true,
    isExpense: true,
    category: {
      showEditPlan: false,
    },
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsCurrent(state, action) {
      state.budget.isCurrent = action.payload;
    },
    setIsExpense(state, action) {
      state.budget.isExpense = action.payload;
    },
    showCategoryPlanEditor(state, action) {
      const { isExpense, showEditPlan } = action.payload;
      state.budget.isExpense = isExpense;
      state.budget.category.showEditPlan = showEditPlan;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
