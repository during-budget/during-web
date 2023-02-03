import { useDispatch, useSelector } from 'react-redux';
import {
    Await,
    defer,
    useLoaderData,
    useNavigate,
    useParams,
} from 'react-router-dom';
import classes from './Budget.module.css';
import BudgetHeader from '../../components/Budget/BudgetHeader';
import Carousel from '../../components/UI/Carousel';
import DateStatus from '../../components/Status/DateStatus';
import TotalStatus from '../../components/Status/TotalStatus';
import CategoryStatus from '../../components/Status/CategoryStatus';
import TransactionNav from '../../components/Transaction/TransactionNav';
import TransactionList from '../../components/Transaction/TransactionList';
import TransactionForm from '../../components/Transaction/TransactionForm';
import { getBudgetById, getTransaction } from '../../util/api';
import { useEffect } from 'react';
import { budgetActions } from '../../store/budget';
import { transactionActions } from '../../store/transaction';
import Transaction from '../../models/Transaction';

function Budget() {
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const { budgetId } = useParams();
    const loaderData: any = useLoaderData();
    const budgets = useSelector((state: any) => state.budgets);
    const budget = budgets.find((item: any) => item.id === budgetId);
    const totalTransactions = useSelector((state: any) => state.transactions);
    const transactions = totalTransactions
        .filter((item: any) => item.budgetId === budgetId)
        .map((item: any) => Transaction.getTransaction(item));

    useEffect(() => {
        dispatch(budgetActions.addBudget(loaderData.budget.budget));
        dispatch(
            transactionActions.setTransaction(
                loaderData.transactions.transactions
            )
        );
    }, []);

    if (!budget || !transactions) {
        // TODO: return error page? loader page?
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
                    {<CategoryStatus budgetId={budgetId!} />}
                </Carousel>
                <hr />
                <section>
                    <TransactionNav id="layout" isExpand={false} />
                    {<TransactionList transactions={transactions} />}
                    <TransactionForm budgetId={budgetId!} />
                </section>
            </main>
        </>
    );
}

export const loader = async (data: any) => {
    const { params } = data;
    return defer({
        budget: await getBudgetById(params.budgetId),
        transactions: await getTransaction(params.budgetId),
    });
};

export default Budget;
