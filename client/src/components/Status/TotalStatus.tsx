import { Fragment } from 'react';
import Amount from '../../models/Amount';
import AmountDetail from '../Amount/AmountDetail';
import AmountRing from '../Amount/AmountRing';

function TotalStatus(props: {
    budgetId: string;
    total: { expense: Amount; income: Amount };
}) {
    return (
        <Fragment>
            <AmountRing amount={props.total.expense} />
            <AmountDetail
                budgetId={props.budgetId}
                isExpense={true}
                amount={props.total.expense}
            />
        </Fragment>
    );
}

export default TotalStatus;
