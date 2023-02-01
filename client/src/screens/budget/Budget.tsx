import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import classes from './Budget.module.css';
import BudgetHeader from '../../components/Budget/BudgetHeader';
import Carousel from '../../components/UI/Carousel';
import DateStatus from '../../components/Status/DateStatus';
import TotalStatus from '../../components/Status/TotalStatus';
import CategoryStatus from '../../components/Status/CategoryStatus';
import TransactionNav from '../../components/Transaction/TransactionNav';
import TransactionList from '../../components/Transaction/TransactionList';
import TransactionForm from '../../components/Transaction/TransactionForm';
import { getBudgetById } from '../../util/api';
import { useEffect } from 'react';
import { budgetActions } from '../../store/budget';

function Budget() {
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const { budgetId } = useParams();
    const loaderData: any = useLoaderData();
    const budgets = useSelector((state: any) => state.budgets);
    const budget = budgets.find((item: any) => item.id === budgetId);

    useEffect(() => {
        if (!budget) {
            dispatch(budgetActions.addBudget(loaderData.budget));
        }
    }, [budget, loaderData.budget, dispatch]);

    if (!budget) {
        // TODO: return error page?
        return <></>;
    }

    const { title, startDate, endDate, total } = budget;

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
                    <TotalStatus budgetId={budgetId!} total={total} />
                    {<CategoryStatus />}
                </Carousel>
                <hr />
                <section>
                    <TransactionNav id="layout" isExpand={false} />
                    {<TransactionList budgetId={budgetId!} />}
                    <TransactionForm budgetId={budgetId!} />
                </section>
            </main>
        </>
    );
}

export const loader = (data: any) => {
    const { params } = data;
    return getBudgetById(params.budgetId);
};

export default Budget;
