import classes from './BudgetDetail.module.css';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import BudgetHeader from '../../components/Budget/BudgetHeader';
import StatusCarousel from '../../components/Status/StatusCarousel';
import TransactionLayout from '../../components/Transaction/TransactionLayout';

function BudgetDetail() {
    const { budgetId } = useParams();
    const budgets = useSelector((state: any) => state.budgets);
    const budget = budgets.find((item: any) => item.id === budgetId);

    if (!budget) {
        throw new Error("Budget doesn`'t exists");
    }

    const { startDate, endDate, title, total } = budget;

    return (
        <>
            <BudgetHeader
                startDate={startDate}
                endDate={endDate}
                title={title}
            />
            <main className={classes.container}>
                <StatusCarousel
                    initialIndex={1}
                    budgetId={budget.id}
                    amount={total}
                />
                <hr />
                <TransactionLayout budgetId={budget.id} />
            </main>
        </>
    );
}

export default BudgetDetail;
