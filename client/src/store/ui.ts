import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    transactionForm: {
        id: undefined,
        linkId: undefined,
        isEdit: undefined,
        isExpand: false,
        isCompleted: undefined,
        isCurrent: false,
        isExpense: true,
        input: {},
    },
    budgetForm: {
        isShow: false,
        startDate: undefined,
        endDate: undefined,
        title: undefined,
        categories: [],
        expensePlanned: 0,
        incomePlanned: 0,
    },
    categoryForm: {
        isShow: false,
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
                linkId,
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
            if (linkId) {
                state.transactionForm.linkId = linkId;
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
        setBudgetForm(state, action) {
            state.budgetForm = action.payload;
        },
        resetBudgetForm(state) {
            state.budgetForm = initialState.budgetForm;
        },
        setCategoryForm(state, action) {
            const data = action.payload;
            state.categoryForm.isShow = data.isShow;
        },
    },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
