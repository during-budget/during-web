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
import { Suspense, useEffect } from 'react';
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
            dispatch(budgetActions.addBudget(loaderData.budget.budget));
        }
    }, [budget, loaderData.budget.budget, dispatch]);

    if (!budget) {
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
                    <Suspense fallback={<p>loading..</p>}>
                        <Await
                            resolve={loaderData.transactions}
                            children={(data) => (
                                <>
                                    <TransactionNav
                                        id="layout"
                                        isExpand={false}
                                    />
                                    {
                                        <TransactionList
                                            transactions={data.transactions}
                                        />
                                    }
                                    <TransactionForm budgetId={budgetId!} />
                                </>
                            )}
                        ></Await>
                    </Suspense>
                </section>
            </main>
        </>
    );
}

export const loader = async (data: any) => {
    const { params } = data;
    return defer({
        budget: await getBudgetById(params.budgetId),
        transactions: getTransaction(params.budgetId),
    });
};

export default Budget;
