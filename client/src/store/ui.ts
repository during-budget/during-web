import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    budget: {
        isCurrent: true,
        isExpense: true,
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
    },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
