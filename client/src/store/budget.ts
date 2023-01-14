import { createSlice } from '@reduxjs/toolkit';
import Amount from '../models/Amount';
import Category from '../models/Category';

const initialState = {
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 0, 31),
    title: '1월 예산',
    total: new Amount(14000, 18000, 30000),
    category: [
        new Category('c1', '비상금', '💰', 120000),
        new Category('c2', '교통비', '🚉', 300000),
        new Category('c3', '경조사비', '🎉', 250000),
        new Category('c4', '식비', '🍚', 400000),
        new Category('c5', '건강', '🏃‍♀️', 100000),
        new Category('c6', '교육', '🎓', 180000),
    ],
    transactions: {},
};

const pushTransaction = (state: any, item: any, type: string) => {
    const logs = state.transactions[type];
    const currentLog = logs.find((log: any) => log.date === item.date);
    if (currentLog) {
        currentLog.items.unshift(item);
    } else {
        logs.unshift({ date: item.date, items: [item] });
    }
};

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        updateTotalAmount(state, action) {
            const amount = action.payload;
            state.total = amount;
        },
        addTransaction(state, action) {
            const item = action.payload;

            if (item.isCurrent) {
                state.total.current += item.amount;
            } else {
                state.total.scheduled += item.amount;

                // category
                const currentCategory = state.category.find(
                    (categoryItem) => categoryItem.id === item.category.id
                );
                if (currentCategory) {
                    currentCategory.amount += item.amount;
                } else {
                    state.category.push({
                        ...item.category,
                        amount: item.amount,
                    });
                }
            }
        },
        removeTransaction(state, action) {},
    },
});

export const budgetActions = budgetSlice.actions;
export default budgetSlice.reducer;
