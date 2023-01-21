import { createSlice } from '@reduxjs/toolkit';
import Amount from '../models/Amount';
import Category from '../models/Category';

const initialState: Category[] = [
    new Category({
        id: 'c1',
        title: '비상금',
        amounts: { b1: new Amount(40000, 40000, 120000) },
        icon: '💰',
    }),
    new Category({
        id: 'c2',
        title: '교통비',
        amounts: { b1: new Amount(180000, 250000, 300000) },
        icon: '🚉',
    }),
    new Category({
        id: 'c3',
        title: '경조사비',
        amounts: { b1: new Amount(50000, 80000, 250000) },
        icon: '🎉',
    }),
    new Category({
        id: 'c4',
        title: '식비',
        amounts: { b1: new Amount(280000, 360000, 400000) },
        icon: '🍚',
    }),
    new Category({
        id: 'c5',
        title: '건강',
        amounts: { b1: new Amount(40000, 120000, 250000) },
        icon: '🏃‍♀️',
    }),
    new Category({
        id: 'c6',
        title: '교육',
        amounts: { b1: new Amount(80000, 160000, 180000) },
        icon: '🎓',
    }),
];

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        craeteCategory(state, action) {
            const { budgetId, icon, title, budgetAmount } = action.payload;
            const id = +new Date() + '';
            state.push(
                new Category({
                    id,
                    icon,
                    title,
                    initialData: { budgetId, budgetAmount },
                })
            );
        },
        updateAmount(state, action) {
            const { categoryId, budgetId, isCurrent, amount } = action.payload;
            const category = state.find((item: any) => item.id === categoryId);

            if (!category) {
                throw new Error('Category not exists.');
            }

            const currentAmount = category.amounts[budgetId];
            const nextAmount = Amount.getUpdatedAmount(
                currentAmount,
                isCurrent,
                amount
            );
            category.amounts[budgetId] = nextAmount;
        },
    },
});

export const categoryActions = categorySlice.actions;
export default categorySlice.reducer;
