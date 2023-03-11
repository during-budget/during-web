import { useState } from 'react';
import Amount from '../../../models/Amount';
import AmountDetail from '../Amount/AmountDetail';
import AmountRing from '../Amount/AmountRing';
import ExpenseTab from '../UI/ExpenseTab';

function TotalStatus(props: { total: { expense: Amount; income: Amount } }) {
    const [isExpense, setIsExpense] = useState(true);
    const total = isExpense ? props.total.expense : props.total.income;

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
            <AmountDetail id="total" amount={total} />
        </>
    );
}

export default TotalStatus;
