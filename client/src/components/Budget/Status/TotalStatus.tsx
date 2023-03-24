import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Amount from '../../../models/Amount';
import { budgetActions } from '../../../store/budget';
import { updateBudgetFields } from '../../../util/api/budgetAPI';
import AmountDetail from '../Amount/AmountDetail';
import AmountRing from '../Amount/AmountRing';
import ExpenseTab from '../UI/ExpenseTab';

function TotalStatus(props: {
    budgetId: string;
    total: { expense: Amount; income: Amount };
}) {
    const dispatch = useDispatch();

    const [isExpense, setIsExpense] = useState(true);
    const total = isExpense ? props.total.expense : props.total.income;

    const updatePlan = (amount: number) => {
        dispatch(
            budgetActions.updateTotalPlan({
                budgetId: props.budgetId,
                isExpense,
                amount,
            })
        );

        const key = isExpense ? 'expensePlanned' : 'incomePlanned';

        updateBudgetFields(props.budgetId, {
            [key]: amount,
        });
    };

    return (
        <>
            <ExpenseTab
                id="total-nav"
                isExpense={isExpense}
                setIsExpense={setIsExpense}
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
