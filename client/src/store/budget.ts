import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Budget from '../models/Budget';
import Category from '../models/Category';
import { BudgetDataType } from '../util/api/budgetAPI';
import Transaction from '../models/Transaction';
import { BudgetCategoryType, UserCategoryType } from '../util/api/categoryAPI';

const initialState: {
    [id: string]: Budget;
} = {};

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        setBudgets(state, action: PayloadAction<BudgetDataType[]>) {
            const budgets = action.payload;

            // NOTE: Init state
            for (const item in state) delete state[item];

            budgets.forEach((item) => {
                const budget = Budget.getBudgetFromData(item);
                state[budget.id] = budget;
            });
        },
        setBudget(state, action: PayloadAction<BudgetDataType>) {
            const budgetData: BudgetDataType = action.payload;
            const budget = Budget.getBudgetFromData(budgetData);

            state[budget.id] = budget;
        },
        updateBudget(state, action: PayloadAction<Budget | BudgetDataType>) {
            let budget = action.payload;

            if (!('id' in budget)) {
                budget = Budget.getBudgetFromData(budget);
            }

            state[budget.id] = budget;
        },
        setCategories(
            state,
            action: PayloadAction<{
                budgetId: string;
                categories: BudgetCategoryType[];
            }>
        ) {
            const { budgetId, categories: categoryData } = action.payload;

            if (!state[budgetId])
                throw new Error(
                    'Fail to set categories. Budget not exists: ' + budgetId
                );

            const categories = categoryData.map((item) =>
                Category.getCategoryFromData(item)
            );

            const budget = Budget.getBudgetUpdatedCategory(
                state[budgetId] as Budget,
                categories
            );

            state[budgetId] = budget;
        },
        updateCategory(
            state,
            action: PayloadAction<{
                budgetId: string;
                isExpense: boolean;
                categories: Category[];
            }>
        ) {
            const { budgetId, isExpense, categories } = action.payload;

            if (!state[budgetId])
                throw new Error(
                    'Fail to update category. Budget not exists: ' + budgetId
                );

            const budget = state[budgetId] as Budget;
            const otherCategories = budget.categories.filter(
                (item) =>
                    item.isExpense !== isExpense || item.isDefault === true
            );

            state[budgetId] = Budget.getBudgetUpdatedCategory(budget, [
                ...categories,
                ...otherCategories,
            ]);
        },
        updateCategoryFromSetting(
            state,
            action: PayloadAction<{
                budgetId: string;
                categories: UserCategoryType[];
            }>
        ) {
            const { budgetId, categories: settings } = action.payload;

            if (!state[budgetId])
                throw new Error('Budget not exists: ' + budgetId);

            const budget = state[budgetId] as Budget;
            const categories = budget.categories.map((item) => {
                const settingData = settings.find(
                    (setting: any) => setting._id === item.id
                );

                if (settingData) {
                    const { icon, title } = settingData;
                    item.icon = icon;
                    item.title = title;
                }

                return item;
            }) as Category[];

            state[budgetId] = Budget.getBudgetUpdatedCategory(
                budget,
                categories
            );
        },
        updateTotalAmount(
            state,
            action: PayloadAction<{
                budgetId: string;
                isExpense: boolean;
                isCurrent: boolean;
                amount: number;
            }>
        ) {
            const { budgetId, isExpense, isCurrent, amount } = action.payload;

            if (!state[budgetId])
                throw new Error(
                    'Fail to update total amount. Budget not exists: ' +
                        budgetId
                );

            state[budgetId] = Budget.getBudgetUpdatedTotalAmount(
                state[budgetId] as Budget,
                isExpense,
                isCurrent,
                amount
            );
        },
        updateCategoryAmount(
            state,
            action: PayloadAction<{
                budgetId: string;
                categoryId: string;
                isCurrent: boolean;
                amount: number;
            }>
        ) {
            const { budgetId, categoryId, isCurrent, amount } = action.payload;

            if (!state[budgetId])
                throw new Error(
                    'Fail to update category amount. Budget not exists: ' +
                        budgetId
                );

            state[budgetId] = Budget.getBudgetUpdatedCategoryAmount(
                state[budgetId] as Budget,
                categoryId,
                isCurrent,
                amount
            );
        },
        // TODO: category array를 map으로 변경한 뒤 업데이트 필요.. 너무 복잡시럽다 (과연?)
        updateTransactionAmount(
            state,
            action: PayloadAction<{
                budgetId: string;
                prev: Transaction;
                next: Transaction;
            }>
        ) {
            const { budgetId, prev, next } = action.payload;

            if (!state[budgetId])
                throw new Error(
                    'Fail to update transaction amount. Budget not exists: ' +
                        budgetId
                );

            const prevState = prev.isCurrent ? 'current' : 'scheduled';
            const nextState = next.isCurrent ? 'current' : 'scheduled';

            const prevType = prev.isExpense ? 'expense' : 'income';
            const nextType = next.isExpense ? 'expense' : 'income';

            const amount = next.amount;
            const nextBudget = state[budgetId];

            if (prev.categoryId !== next.categoryId) {
                const prevIdx = nextBudget.categories.findIndex(
                    (item) => item.id === prev.categoryId
                );
                const nextIdx = nextBudget.categories.findIndex(
                    (item) => item.id === next.categoryId
                );

                if (0 <= prevIdx) {
                    nextBudget.categories[prevIdx].amount[prevState] -= amount;
                }
                if (0 <= nextIdx) {
                    nextBudget.categories[nextIdx].amount[nextState] += amount;
                }
            }

            if (prevState !== nextState || prevType !== nextType) {
                nextBudget.total[prevType][prevState] -= amount;
                nextBudget.total[nextType][nextState] += amount;
            }

            state[budgetId] = nextBudget;
        },
        updateTotalPlan(
            state,
            action: PayloadAction<{
                budgetId: string;
                isExpense: boolean;
                amount: number;
            }>
        ) {
            const { budgetId, isExpense, amount } = action.payload;

            if (!state[budgetId])
                throw new Error(
                    'Failed to update total plan. Budget not exists: ' +
                        budgetId
                );

            state[budgetId] = Budget.getBudgetUpdatedPlan(
                state[budgetId] as Budget,
                isExpense,
                amount
            );
        },
        // TODO: 왜 안쓰는지 파악해야 함..
        // updateCategoryPlan(
        //     state,
        //     action: PayloadAction<{
        //         budgetId: string;
        //         categoryId: string;
        //         amount: number;
        //     }>
        // ) {
        //     const { budgetId, categoryId, amount } = action.payload;

        //     if (!state[budgetId]) throw new Error('Budget not exists');

        //     state[budgetId] = Budget.getBudgetUpdatedCategoryPlan(
        //         state[budgetId] as Budget,
        //         categoryId,
        //         amount
        //     );
        // },
    },
});

export const budgetActions = budgetSlice.actions;
export default budgetSlice.reducer;
