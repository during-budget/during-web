import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Category from '../models/Category';
import { UserCategoryType } from '../util/api/categoryAPI';

const initialState: {
    [id: string]: Category;
} = {};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategories(state, action: PayloadAction<UserCategoryType[]>) {
            const categories = action.payload;

            // NOTE: Init state
            for (const item in state) delete state[item];

            categories.forEach((data) => {
                const category = Category.getCategoryFromData(data);
                state[category.id] = category;
            });
        },
    },
});

export const categoryActions = categorySlice.actions;
export default categorySlice.reducer;
