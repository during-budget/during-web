import { Fragment, useState } from 'react';
import classes from './TotalStatus.module.css';
import Amount from '../../models/Amount';
import AmountDetail from '../Amount/AmountDetail';
import AmountRing from '../Amount/AmountRing';

function TotalStatus(props: {
    budgetId: string;
    total: { expense: Amount; income: Amount };
}) {
    const [isExpense, setIsExpense] = useState(true);
    return (
        <Fragment>
            <ul className={`nav-tab ${classes.nav}`}>
                <li>
                    <input
                        id="total-nav-expense"
                        type="radio"
                        name="total-nav"
                        defaultChecked={true}
                        onClick={() => {
                            setIsExpense(true);
                        }}
                    ></input>
                    <label htmlFor="total-nav-expense">지출</label>
                </li>
                <li>
                    <input
                        id="total-nav-income"
                        type="radio"
                        name="total-nav"
                        onClick={() => {
                            setIsExpense(false);
                        }}
                    ></input>
                    <label htmlFor="total-nav-income">수입</label>
                </li>
            </ul>
            <AmountRing
                isExpense={isExpense}
                amount={isExpense ? props.total.expense : props.total.income}
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
