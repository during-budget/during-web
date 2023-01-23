import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import classes from './Budget.module.css';
import BudgetHeader from '../../components/Budget/BudgetHeader';
import Carousel from '../../components/UI/Carousel';
import DateStatus from '../../components/Status/DateStatus';
import TotalStatus from '../../components/Status/TotalStatus';
import CategoryStatus from '../../components/Status/CategoryStatus';
import TransactionNav from '../../components/Transaction/TransactionNav';
import TransactionList from '../../components/Transaction/TransactionList';
import TransactionForm from '../../components/Transaction/TransactionForm';

function Budget() {
    const navigation = useNavigate();
    const { budgetId } = useParams();
    const budgets = useSelector((state: any) => state.budgets);
    const budget = budgets.find((item: any) => item.id === budgetId);

    if (!budget) {
        throw new Error("Budget doesn`'t exists");
    }

    const { startDate, endDate, title, total } = budget;

    return (
        <>
            <button
                className={classes.back}
                onClick={() => {
                    navigation('/budget');
                }}
            >
                <i className="fa-solid fa-chevron-left"></i>
            </button>
            <BudgetHeader
                startDate={startDate}
                endDate={endDate}
                title={title}
            />
            <main className={classes.container}>
                <Carousel id="status" initialIndex={1}>
                    <DateStatus
                        budgetId={budgetId!}
                        startDate={startDate}
                        endDate={endDate}
                    />
                    <TotalStatus budgetId={budgetId!} amount={total} />
                    <CategoryStatus budgetId={budgetId!} />
                </Carousel>
                <hr />
                <section>
                    <TransactionNav id="layout" isExpand={false} />
                    <TransactionList budgetId={budgetId!} />
                    <TransactionForm budgetId={budgetId!} />
                </section>
            </main>
        </>
    );
}

export default Budget;
