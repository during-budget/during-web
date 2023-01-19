import Carousel from '../UI/Carousel';
import DateStatus from './DateStatus';
import TotalStatus from './TotalStatus';
import CategoryStatus from './CategoryStatus';
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
            <CategoryStatus budgetId={props.budgetId} />
        </Carousel>
    );
}

export default StatusCarousel;
