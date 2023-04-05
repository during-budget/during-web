import { createSlice } from '@reduxjs/toolkit';
import Budget from '../models/Budget';
import Category from '../models/Category';

const initialState: Budget[] = [];

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        setBudgets(state, action) {
            const data = action.payload;
            const budgets = data.map((item: any) =>
                Budget.getBudgetFromData(item)
            );

            state.push(...budgets);
            state.sort(
                (prev, next) =>
                    +new Date(prev.date.start) - +new Date(next.date.start)
            );
        },
        updateBudget(state, action) {
            const { budgetId, budget } = action.payload;
            const idx = state.findIndex((item) => item.id === budgetId);

            if (state[idx]) {
                if (budget instanceof Budget) {
                    state[idx] = budget;
                } else {
                    state[idx] = Budget.getBudgetFromData(budget);
                }
            }
        },
        setCategories(state, action) {
            const { budgetId, categories } = action.payload;
            const idx = state.findIndex((item) => item.id === budgetId);

            if (state[idx]) {
                state[idx] = Budget.getBudgetUpdatedCategory(
                    state[idx] as Budget,
                    categories
                );
            }
        },
        updateCategory(state, action) {
            const { budgetId, isExpense, categories } = action.payload;
            const idx = state.findIndex((item) => item.id === budgetId);

            if (state[idx]) {
                const otherTypeCategories = state[idx].categories.filter(
                    (item) =>
                        item.isExpense !== isExpense || item.isDefault === true
                );

                state[idx] = Budget.getBudgetUpdatedCategory(
                    state[idx] as Budget,
                    [...categories, ...otherTypeCategories]
                );
            }
        },
        updateCategoryFromSetting(state, action) {
            const { budgetId, categories: settings } = action.payload;
            const idx = state.findIndex((item) => item.id === budgetId);

            if (state[idx]) {
                const categories = state[idx].categories.map((item) => {
                    const settingData = settings.find(
                        (setting: any) => setting._id === item.id
                    );

                    if (settingData) {
                        const { icon, title } = settingData;
                        item.icon = icon;
                        item.title = title;
                    }

                    return item;
                });

                state[idx] = Budget.getBudgetUpdatedCategory(
                    state[idx] as Budget,
                    categories as Category[]
                );
            }
        },
        updateTotalAmount(state, action) {
            const { budgetId, isExpense, isCurrent, amount } = action.payload;
            const idx = state.findIndex((item) => item.id === budgetId);

            if (state[idx]) {
                state[idx] = Budget.getBudgetUpdatedTotalAmount(
                    state[idx],
                    isExpense,
                    isCurrent,
                    amount
                );
            }
        },
        updateCategoryAmount(state, action) {
            const { budgetId, categoryId, isCurrent, amount } = action.payload;
            const idx = state.findIndex((item) => item.id === budgetId);

            if (state[idx]) {
                state[idx] = Budget.getBudgetUpdatedCategoryAmount(
                    state[idx],
                    categoryId,
                    isCurrent,
                    +amount
                );
            }
        },
        // TODO: array를 map으로 변경한 뒤 업데이트 필요.. 너무 복잡시럽다
        updateTransactionAmount(state, action) {
            const { budgetId, prev, next } = action.payload;

            const idx = state.findIndex((item) => item.id === budgetId);

            const prevState = prev.isCurrent ? 'current' : 'scheduled';
            const nextState = next.isCurrent ? 'current' : 'scheduled';

            const prevType = prev.isExpense ? 'expense' : 'income';
            const nextType = next.isExpense ? 'expense' : 'income';

            if (state[idx]) {
                const amount = next.amount;
                const nextBudget = state[idx];

                if (prev.categoryId !== next.categoryId) {
                    const prevIdx = nextBudget.categories.findIndex(
                        (item) => item.id === prev.categoryId
                    );
                    const nextIdx = nextBudget.categories.findIndex(
                        (item) => item.id === next.categoryId
                    );

                    nextBudget.categories[prevIdx].amount[prevState] -= amount;
                    nextBudget.categories[nextIdx].amount[nextState] += amount;
                }

                if (prevState !== nextState || prevType !== nextType) {
                    nextBudget.total[prevType][prevState] -= amount;
                    nextBudget.total[nextType][nextState] += amount;
                }

                state[idx] = nextBudget;
            }
        },
        updateTotalPlan(state, action) {
            const { budgetId, isExpense, amount } = action.payload;
            const idx = state.findIndex((item) => item.id === budgetId);
            if (state[idx]) {
                state[idx] = Budget.getBudgetUpdatedPlan(
                    state[idx],
                    isExpense,
                    amount
                );
            }
        },
        updateCategoryPlan(state, action) {
            const { budgetId, categoryId, amount } = action.payload;
            const idx = state.findIndex((item) => item.id === budgetId);
            if (state[idx]) {
                state[idx] = Budget.getBudgetUpdatedCategoryPlan(
                    state[idx],
                    categoryId,
                    amount
                );
            }
        },
    },
});

export const budgetActions = budgetSlice.actions;
export default budgetSlice.reducer;
