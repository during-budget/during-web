import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    transactionForm: {
        isExpand: false,
        input: {},
    },
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setTransactionForm(state, action) {
            const { isExpand, input } = action.payload;
            state.transactionForm.isExpand = isExpand;
            if (input) {
                state.transactionForm.input = input;
            }
        },
    },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
