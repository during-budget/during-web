import { createSlice } from '@reduxjs/toolkit';
import Amount from '../models/Amount';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

const initialState = {
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 0, 31),
    title: '1월 예산',
    total: new Amount(14000, 18000, 30000),
    category: [
        new Category({
            id: 'c1',
            title: '비상금',
            icon: '💰',
            budget: 120000,
        }),
        new Category({
            id: 'c2',
            title: '교통비',
            icon: '🚉',
            budget: 300000,
        }),
        new Category({
            id: 'c3',
            title: '경조사비',
            icon: '🎉',
            budget: 250000,
        }),
        new Category({
            id: 'c4',
            title: '식비',
            icon: '🍚',
            budget: 400000,
        }),
        new Category({
            id: 'c5',
            title: '건강',
            icon: '🏃‍♀️',
            budget: 100000,
        }),
        new Category({
            id: 'c6',
            title: '교육',
            icon: '🎓',
            budget: 180000,
        }),
    ],
    transactions: {
        current: [
            {
                date: new Date(2022, 11, 29),
                items: [
                    new Transaction({
                        id: '01',
                        isCurrent: true,
                        isExpense: true,
                        title: ['제목1', '제목2'],
                        date: new Date(2022, 11, 29),
                        amount: 3000,
                        category: new Category({
                            id: '01',
                            title: '분류명',
                            budget: 60000,
                            icon: '💰',
                        }),
                    }),
                    new Transaction({
                        id: '02',
                        isCurrent: true,
                        isExpense: true,
                        title: ['제목1', '제목2'],
                        date: new Date(2022, 11, 29),
                        amount: 3000,
                        category: new Category({
                            id: '01',
                            title: '분류명',
                            budget: 60000,
                            icon: '💰',
                        }),
                        tags: ['태그명'],
                    }),
                    new Transaction({
                        id: '03',
                        isCurrent: true,
                        isExpense: true,
                        title: ['제목1', '제목2'],
                        date: new Date(2022, 11, 29),
                        amount: 3000,
                        category: new Category({
                            id: '01',
                            title: '분류명',
                            budget: 60000,
                            icon: '💰',
                        }),
                    }),
                ],
            },
            {
                date: new Date(2022, 11, 28),
                items: [
                    new Transaction({
                        id: '04',
                        isCurrent: true,
                        isExpense: true,
                        title: [
                            '내역명',
                            '제목이 아주 길어진다면 어떻게 될까요',
                        ],
                        date: new Date(2022, 11, 28),
                        amount: 300000,
                        category: new Category({
                            id: '01',
                            title: '분류명',
                            budget: 60000,
                            icon: '💰',
                        }),
                        tags: ['태그명', '태그명태그', '태그', '태그명태그명'],
                    }),
                ],
            },
        ],
        scheduled: [
            {
                date: new Date(2022, 11, 31),
                items: [
                    new Transaction({
                        id: '05',
                        isCurrent: false,
                        isExpense: true,
                        title: ['예정명', '예정예정'],
                        date: new Date(2022, 11, 31),
                        amount: 3000,
                        category: new Category({
                            id: '01',
                            title: '분류명',
                            budget: 60000,
                            icon: '💰',
                        }),
                        tags: [
                            '태그명',
                            '태그명태그',
                            '태그',
                            '태그태그',
                            '태그명태그명',
                        ],
                    }),
                ],
            },
        ],
    },
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

            // transactions & total
            if (item.isCurrent) {
                pushTransaction(state, item, 'current');
                state.total.current += item.amount;
            } else {
                pushTransaction(state, item, 'scheduled');
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
