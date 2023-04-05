import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Amount from '../../../models/Amount';
import { budgetActions } from '../../../store/budget';
import { uiActions } from '../../../store/ui';
import { updateBudgetFields } from '../../../util/api/budgetAPI';
import AmountDetail from '../Amount/AmountDetail';
import AmountRing from '../Amount/AmountRing';
import ExpenseTab from '../UI/ExpenseTab';

function TotalStatus(props: {
    budgetId: string;
    total: { expense: Amount; income: Amount };
}) {
    const dispatch = useDispatch();

    const isExpense = useSelector((state: any) => state.ui.budget.isExpense);
    const total = isExpense ? props.total.expense : props.total.income;

    const updatePlan = async (amountStr: string) => {
        // send Request
        const key = isExpense ? 'expensePlanned' : 'incomePlanned';
        const amount = +amountStr;

        const { budget } = await updateBudgetFields(props.budgetId, {
            [key]: amount,
        });

        // Update budget state (for plan update)
        dispatch(
            budgetActions.updateBudget({ budgetId: props.budgetId, budget })
        );
    };

    return (
        <>
            <ExpenseTab
                id="total-nav"
                isExpense={isExpense}
                setIsExpense={(isExpense: boolean) => {
                    dispatch(uiActions.setIsExpense(isExpense));
                }}
            />
            <AmountRing
                amount={total}
                size="18rem"
                r="30%"
                thickness="3rem"
                dash={544}
                blur={6}
            />
            <AmountDetail
                id="total"
                amount={total}
                editPlanHandler={updatePlan}
            />
        </>
    );
}

export default TotalStatus;
