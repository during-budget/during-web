import classes from './BudgetDetail.module.css';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import BudgetHeader from '../../components/Budget/BudgetHeader';
import StatusCarousel from '../../components/Status/StatusCarousel';
import TransactionLayout from '../../components/Transaction/TransactionLayout';

function BudgetDetail() {
    const { startDate, endDate, title } = useSelector(
        (state: any) => state.budget
    );
    const { budgetId } = useParams();
    return (
        <>
            <BudgetHeader
                startDate={startDate}
                endDate={endDate}
                title={title}
            />
            <main className={classes.container}>
                <StatusCarousel initialIndex={1} />
                <hr />
                <TransactionLayout />
            </main>
        </>
    );
}

export default BudgetDetail;
