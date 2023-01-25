import { Fragment } from 'react';
import Amount from '../../models/Amount';
import AmountDetail from '../Amount/AmountDetail';
import AmountRing from '../Amount/AmountRing';

function TotalStatus(props: { budgetId: string; amount: Amount }) {
    return (
        <Fragment>
            <AmountRing amount={props.amount} />
            <AmountDetail budgetId={props.budgetId} amount={props.amount} />
        </Fragment>
    );
}

export default TotalStatus;
