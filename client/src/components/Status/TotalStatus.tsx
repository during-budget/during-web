import { Fragment } from 'react';
import Amount from '../../models/Amount';
import AmountDetail from '../Amount/AmountDetail';
import AmountDoughnut from '../Amount/AmountDoughnut';

function TotalStatus(props: { budgetId: string; amount: Amount }) {
    return (
        <Fragment>
            <AmountDoughnut amount={props.amount} />
            <AmountDetail budgetId={props.budgetId} amount={props.amount} />
        </Fragment>
    );
}

export default TotalStatus;
