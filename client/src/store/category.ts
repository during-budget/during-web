import { createSlice } from '@reduxjs/toolkit';
import Category from '../models/Category';

const initialState: Category[] = [];

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategory(state, action) {
            const categories = action.payload;
            categories.forEach((category: any) => {
                const { _id: id, title, icon, isExpense, isIncome } = category;
                state.push(
                    new Category({ id, title, icon, isExpense, isIncome })
                );
            });
        },
        craeteCategory(state, action) {
            // const { budgetId, icon, title, budgetAmount } = action.payload;
            // const id = +new Date() + '';
            // state.push(
            //     new Category({
            //         id,
            //         icon,
            //         title,
            //         // initialData: { budgetId, budgetAmount },
            //     })
            // );
        },
        // TODO: budget에서 소속 category amount 업데이트 하기,,
        updateAmount(state, action) {
            const { categoryId, budgetId, isCurrent, amount } = action.payload;
            const category = state.find((item: any) => item.id === categoryId);

            if (!category) {
                throw new Error('Category not exists.');
            }

            // const currentAmount = category.amounts[budgetId];
            // const nextAmount = Amount.getUpdatedAmount(
            //     currentAmount,
            //     isCurrent,
            //     amount
            // );
            // category.amounts[budgetId] = nextAmount;
        },
        updatePlannedAmount(state, action) {
            // TODO: Implement UpdatePlannedAmount

            // const { budgetId, isExpense, amount } = action.payload;
            // const idx = state.findIndex((item) => item.id === budgetId);
            // if (state[idx]) {
            //     state[idx] = Budget.getBudgetUpdatedPlan(
            //         state[idx],
            //         isExpense,
            //         amount
            //     );
            // }
        }
    },
});

export const categoryActions = categorySlice.actions;
export default categorySlice.reducer;
