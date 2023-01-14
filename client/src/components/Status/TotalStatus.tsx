import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import AmountDetail from '../Amount/AmountDetail';
import AmountDoughnut from '../Amount/AmountDoughnut';

function TotalStatus() {
    const amount = useSelector((state: any) => state.budget.total);
    return (
        <Fragment>
            <AmountDoughnut amount={amount} />
            <AmountDetail amount={amount} />
        </Fragment>
    );
}

export default TotalStatus;
