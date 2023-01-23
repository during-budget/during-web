import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    transactionForm: {
        id: undefined,
        isEdit: undefined,
        isCurrent: undefined,
        isExpand: false,
        input: {},
    },
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        resetTransactionForm(state) {
            state.transactionForm = initialState.transactionForm;
        },
        setTransactionForm(state, action) {
            const { id, isEdit, isExpand, isCurrent, input } = action.payload;
            if (id) {
                state.transactionForm.id = id;
            }
            if (isEdit !== undefined && isEdit !== null) {
                state.transactionForm.isEdit = isEdit;
            }
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
