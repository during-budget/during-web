import { createSlice } from '@reduxjs/toolkit';
import Category from '../models/Category';

const initialState: Category[] = [];

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategories(state, action) {
            const categories = action.payload;

            state.splice(0); // init;

            categories.forEach((category: any) => {
                const { _id: id, title, icon, isExpense, isDefault } = category;
                state.push(
                    new Category({ id, title, icon, isExpense, isDefault })
                );
            });
        },
        updateCategories(state, action) {
            const { isExpense, categories } = action.payload;
            if (isExpense === undefined) {
                state.splice(0); // init
                state.push(...categories);
            } else {
                const otherCategories = state.filter(
                    (item) => item.isExpense !== isExpense
                );
                state.splice(0); // init
                state.push(...categories, ...otherCategories);
            }
        },
    },
});

export const categoryActions = categorySlice.actions;
export default categorySlice.reducer;
