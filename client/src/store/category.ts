import { createSlice } from '@reduxjs/toolkit';
import Amount from '../models/Amount';
import Category from '../models/Category';

const initialState: Category[] = [];

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategory(state, action) {
            const { categories } = action.payload;
            console.log(action.payload);
            categories.forEach(
                (category: { _id: string; title: string; icon: string }) => {
                    const { _id: id, title, icon } = category;
                    state.push(new Category({ id, title, icon }));
                }
            );
        },
        craeteCategory(state, action) {
            const { budgetId, icon, title, budgetAmount } = action.payload;
            const id = +new Date() + '';
            state.push(
                new Category({
                    id,
                    icon,
                    title,
                    // initialData: { budgetId, budgetAmount },
                })
            );
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
    },
});

export const categoryActions = categorySlice.actions;
export default categorySlice.reducer;
