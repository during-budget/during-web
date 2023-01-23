import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    transactionForm: {
        isCurrent: false,
        isExpand: false,
        input: {},
    },
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setTransactionForm(state, action) {
            const { isExpand, isCurrent, input } = action.payload;
            if (isCurrent !== undefined && isCurrent !== null) {
                state.transactionForm.isCurrent = isCurrent;
            }
            if (isExpand !== undefined && isExpand !== null) {
                state.transactionForm.isExpand = isExpand;
            }
            if (input) {
                state.transactionForm.input = input;
            }
        },
    },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
