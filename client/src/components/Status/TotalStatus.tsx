import { Fragment, useState } from 'react';
import classes from './TotalStatus.module.css';
import Amount from '../../models/Amount';
import AmountDetail from '../Amount/AmountDetail';
import AmountRing from '../Amount/AmountRing';
import RadioTab from '../UI/RadioTab';
import { budgetActions } from '../../store/budget';
import { useDispatch } from 'react-redux';

function TotalStatus(props: {
    budgetId: string;
    total: { expense: Amount; income: Amount };
}) {
    const dispatch = useDispatch();
    const [isExpense, setIsExpense] = useState(true);

    const { budgetId, total } = props;

    const expenseHandler = () => {
        setIsExpense(true);
    };

    const incomeHandler = () => {
        setIsExpense(false);
    };

    const editDetailHandler = (amount: number) => {
        dispatch(
            budgetActions.updatePlannedAmount({
                budgetId,
                isExpense,
                amount,
            })
        );
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
                amount={isExpense ? total.expense : total.income}
                size="16rem"
                width="3rem"
                dash={482.5}
                blur={6}
                showMsg={true}
            />
            <AmountDetail
                amount={isExpense ? total.expense : total.income}
                onEdit={editDetailHandler}
            />
        </Fragment>
    );
}

export default TotalStatus;
