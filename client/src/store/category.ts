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
    },
});

export const categoryActions = categorySlice.actions;
export default categorySlice.reducer;
