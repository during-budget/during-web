import Carousel from '../UI/Carousel';
import DateStatus from './DateStatus';
import TotalStatus from './TotalStatus';
import Amount from '../../models/Amount';

function StatusCarousel(props: {
    initialIndex: number;
    budgetId: string;
    amount: Amount;
}) {
    return (
        <Carousel id="status" initialIndex={props.initialIndex}>
            <DateStatus />
            <TotalStatus budgetId={props.budgetId} amount={props.amount} />
        </Carousel>
    );
}

export default StatusCarousel;
