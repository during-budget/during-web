import { createSlice } from '@reduxjs/toolkit';
import Budget from '../models/Budget';
import Category from '../models/Category';

const initialState: {
    data: Budget[];
    default?: Budget;
} = {
    data: [],
    default: undefined,
};

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        setBudgets(state, action) {
            const budgets = action.payload;

            state.data = budgets.map((item: any) =>
                Budget.getBudgetFromData(item)
            );
            state.data.sort(
                (prev, next) =>
                    +new Date(prev.date.start) - +new Date(next.date.start)
            );
        },
        setDefaultBudget(state, action) {
            const defaultBudget = action.payload;
            state.default = Budget.getBudgetFromData(defaultBudget);
        },
        updateBudget(state, action) {
            const { budgetId, budget } = action.payload;

            const data = state.data;
            const idx = data.findIndex((item) => item.id === budgetId);

            if (data[idx]) {
                if (budget instanceof Budget) {
                    data[idx] = budget;
                } else {
                    data[idx] = Budget.getBudgetFromData(budget);
                }
            }
        },
        setCategories(state, action) {
            const { budgetId, categories } = action.payload;

            const data = state.data;
            const idx = data.findIndex((item) => item.id === budgetId);

            if (data[idx]) {
                data[idx] = Budget.getBudgetUpdatedCategory(
                    data[idx] as Budget,
                    categories
                );
            }
        },
        updateCategory(state, action) {
            const { budgetId, isExpense, categories } = action.payload;

            const data = state.data;
            const idx = data.findIndex((item) => item.id === budgetId);

            if (data[idx]) {
                const otherTypeCategories = data[idx].categories.filter(
                    (item) =>
                        item.isExpense !== isExpense || item.isDefault === true
                );

                data[idx] = Budget.getBudgetUpdatedCategory(
                    data[idx] as Budget,
                    [...categories, ...otherTypeCategories]
                );
            }
        },
        updateCategoryFromSetting(state, action) {
            const { budgetId, categories: settings } = action.payload;

            const data = state.data;
            const idx = data.findIndex((item) => item.id === budgetId);

            if (data[idx]) {
                const categories = data[idx].categories.map((item) => {
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

                data[idx] = Budget.getBudgetUpdatedCategory(
                    data[idx] as Budget,
                    categories as Category[]
                );
            }
        },
        updateTotalAmount(state, action) {
            const { budgetId, isExpense, isCurrent, amount } = action.payload;

            const data = state.data;
            const idx = state.data.findIndex((item) => item.id === budgetId);

            if (data[idx]) {
                data[idx] = Budget.getBudgetUpdatedTotalAmount(
                    data[idx],
                    isExpense,
                    isCurrent,
                    amount
                );
            }
        },
        updateCategoryAmount(state, action) {
            const { budgetId, categoryId, isCurrent, amount } = action.payload;

            const data = state.data;
            const idx = data.findIndex((item) => item.id === budgetId);

            if (data[idx]) {
                data[idx] = Budget.getBudgetUpdatedCategoryAmount(
                    state.data[idx],
                    categoryId,
                    isCurrent,
                    +amount
                );
            }
        },
        // TODO: array를 map으로 변경한 뒤 업데이트 필요.. 너무 복잡시럽다
        updateTransactionAmount(state, action) {
            const { budgetId, prev, next } = action.payload;

            const data = state.data;
            const idx = data.findIndex((item) => item.id === budgetId);

            const prevState = prev.isCurrent ? 'current' : 'scheduled';
            const nextState = next.isCurrent ? 'current' : 'scheduled';

            const prevType = prev.isExpense ? 'expense' : 'income';
            const nextType = next.isExpense ? 'expense' : 'income';

            if (data[idx]) {
                const amount = next.amount;
                const nextBudget = data[idx];

                if (prev.categoryId !== next.categoryId) {
                    const prevIdx = nextBudget.categories.findIndex(
                        (item) => item.id === prev.categoryId
                    );
                    const nextIdx = nextBudget.categories.findIndex(
                        (item) => item.id === next.categoryId
                    );

                    if (0 <= prevIdx) {
                        nextBudget.categories[prevIdx].amount[prevState] -=
                            amount;
                    }
                    if (0 <= nextIdx) {
                        nextBudget.categories[nextIdx].amount[nextState] +=
                            amount;
                    }
                }

                if (prevState !== nextState || prevType !== nextType) {
                    nextBudget.total[prevType][prevState] -= amount;
                    nextBudget.total[nextType][nextState] += amount;
                }

                data[idx] = nextBudget;
            }
        },
        updateTotalPlan(state, action) {
            const { budgetId, isExpense, amount } = action.payload;

            const data = state.data;
            const idx = data.findIndex((item) => item.id === budgetId);

            if (data[idx]) {
                data[idx] = Budget.getBudgetUpdatedPlan(
                    data[idx],
                    isExpense,
                    amount
                );
            }
        },
        updateCategoryPlan(state, action) {
            const { budgetId, categoryId, amount } = action.payload;

            const data = state.data;
            const idx = data.findIndex((item) => item.id === budgetId);
            if (data[idx]) {
                data[idx] = Budget.getBudgetUpdatedCategoryPlan(
                    data[idx],
                    categoryId,
                    amount
                );
            }
        },
    },
});

export const budgetActions = budgetSlice.actions;
export default budgetSlice.reducer;
