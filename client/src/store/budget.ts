import { createSlice } from '@reduxjs/toolkit';
import { convertTypeAcquisitionFromJson } from 'typescript';
import Amount from '../models/Amount';
import Budget from '../models/Budget';

const budgets: Budget[] = [
    // {
    //     id: 'b1',
    //     title: '1월 예산',
    //     startDate: new Date(2023, 0, 1),
    //     endDate: new Date(2023, 0, 31),
    //     total: {
    //         expense: new Amount(310000, 540000, 820000),
    //         income: new Amount(0, 0, 0),
    //     },
    //     categories: [
    //         {
    //             categoryId: '63d23dab0efb4d90194987a3',
    //             amount: new Amount(40000, 40000, 120000),
    //         },
    //         {
    //             categoryId: '63d23dab0efb4d90194987a4',
    //             amount: new Amount(18000, 60000, 160000),
    //         },
    //         {
    //             categoryId: '63d23dab0efb4d90194987a5',
    //             amount: new Amount(180000, 260000, 300000),
    //         },
    //         {
    //             categoryId: '63d23dab0efb4d90194987a6',
    //             amount: new Amount(12000, 40000, 60000),
    //         },
    //         {
    //             categoryId: '63d23dab0efb4d90194987a7',
    //             amount: new Amount(40000, 60000, 80000),
    //         },
    //     ],
    // },
    // {
    //     id: 'b12',
    //     title: '12월 예산',
    //     startDate: new Date(2022, 11, 1),
    //     endDate: new Date(2022, 11, 31),
    //     total: {
    //         expense: new Amount(20000, 60000, 300000),
    //         income: new Amount(0, 0, 0),
    //     },
    //     categories: [{ categoryId: 'c1', amount: new Amount(0, 0, 0) }],
    // },
];

const budgetSlice = createSlice({
    name: 'budget',
    initialState: budgets,
    reducers: {
        setBudgets(state, action) {
            const budgets = action.payload;
            console.log(budgets);
            budgets.forEach((budget: any) => {
                console.log(budget);
                const {
                    _id: id,
                    title,
                    startDate,
                    endDate,
                    expenseCurrent,
                    expenseScheduled,
                    expensePlanned,
                    incomeCurrent,
                    incomeScheduled,
                    incomePlanned,
                    expenseCategories,
                    incomeCategories,
                } = budget;
                const newBudget = new Budget({
                    id,
                    title,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    total: {
                        expense: new Amount(
                            expenseCurrent,
                            expenseScheduled,
                            expensePlanned
                        ),
                        income: new Amount(
                            incomeCurrent,
                            incomeScheduled,
                            incomePlanned
                        ),
                    },
                    categories: [...expenseCategories, ...incomeCategories],
                });
                state.push(newBudget);
            });
        },
        updatePlannedAmount(state, action) {
            const { budgetId, isExpense, amount } = action.payload;
            const budget = state.find((item) => item.id === budgetId);
            if (budget) {
                const key = isExpense ? 'expense' : 'income';
                const total = budget.total[key];
                budget.total[key] = new Amount(
                    total.current,
                    total.scheduled,
                    amount
                );
            }
        },
        updateTotalAmount(state, action) {
            const { budgetId, isExpense, isCurrent, amount } = action.payload;
            const budget = state.find((item) => item.id === budgetId);
            if (budget) {
                const key = isExpense ? 'expense' : 'income';
                budget.total[key] = Amount.getUpdatedAmount(
                    budget.total[key],
                    isCurrent,
                    amount
                );
            }
        },
    },
});

export const budgetActions = budgetSlice.actions;
export default budgetSlice.reducer;
