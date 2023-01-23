import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    transactionForm: {
        id: undefined,
        isEdit: undefined,
        isExpand: false,
        isCompleted: undefined,
        isCurrent: false,
        isExpense: undefined,
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
            const {
                id,
                isExpand,
                isEdit,
                isCompleted,
                isCurrent,
                isExpense,
                input,
            } = action.payload;

            if (id) {
                state.transactionForm.id = id;
            }
            if (isExpand !== undefined && isExpand !== null) {
                state.transactionForm.isExpand = isExpand;
            }
            if (isEdit !== undefined && isEdit !== null) {
                state.transactionForm.isEdit = isEdit;
            }
            if (isCompleted !== undefined && isCompleted !== null) {
                state.transactionForm.isCompleted = isCompleted;
            }
            if (isCurrent !== undefined && isCurrent !== null) {
                state.transactionForm.isCurrent = isCurrent;
            }
            if (isExpense !== undefined && isExpense !== null) {
                state.transactionForm.isExpense = isExpense;
            }
            if (input) {
                state.transactionForm.input = input;
            }
        },
    },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
