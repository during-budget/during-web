import { Fragment, useState } from 'react';
import classes from './TotalStatus.module.css';
import Amount from '../../models/Amount';
import AmountDetail from '../Amount/AmountDetail';
import AmountRing from '../Amount/AmountRing';
import RadioTab from '../UI/RadioTab';

function TotalStatus(props: {
    budgetId: string;
    total: { expense: Amount; income: Amount };
}) {
    const [isExpense, setIsExpense] = useState(true);

    const expenseHandler = () => {
        setIsExpense(true);
    };
    const incomeHandler = () => {
        setIsExpense(false);
    };
    return (
        <Fragment>
            <RadioTab
                className={classes.nav}
                name="total-nav"
                values={[
                    {
                        label: '지출',
                        value: 'expense',
                        defaultChecked: true,
                        onClick: expenseHandler,
                    },
                    {
                        label: '수입',
                        value: 'income',
                        onClick: incomeHandler,
                    },
                ]}
            />
            <AmountRing
                isExpense={isExpense}
                amount={isExpense ? props.total.expense : props.total.income}
                size="16rem"
                width="3rem"
                dash={482.5}
                blur={6}
                showMsg={true}
            />
            <AmountDetail
                budgetId={props.budgetId}
                isExpense={isExpense}
                amount={isExpense ? props.total.expense : props.total.income}
            />
        </Fragment>
    );
}

export default TotalStatus;
