import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    budget: {
        isCurrent: true,
        isExpense: true,
        category: {
            isEditPlan: false,
            isEditList: false,
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
            state.budget.category.isEditPlan = action.payload;
        },
        showCategoryListEditor(state, action) {
            state.budget.category.isEditList = action.payload;
        },
    },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
