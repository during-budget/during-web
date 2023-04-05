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
    },
});

export const categoryActions = categorySlice.actions;
export default categorySlice.reducer;
