import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import CategoryPlan from '../components/Budget/Category/CategoryPlan';
import CategoryStatus from '../components/Budget/Status/CategoryStatus';
import DateStatus from '../components/Budget/Status/DateStatus';
import TotalStatus from '../components/Budget/Status/TotalStatus';
import TransactionLayout from '../components/Budget/Transaction/TransactionLayout';
import BudgetHeader from '../components/Budget/UI/BudgetHeader';
import Carousel from '../components/UI/Carousel';
import { useAppDispatch } from '../hooks/redux-hook';
import { budgetCategoryActions } from '../store/budget-category';
import { totalActions } from '../store/total';
import { transactionActions } from '../store/transaction';
import { getBudgetById } from '../util/api/budgetAPI';
import classes from './Budget.module.css';

function Budget() {
  const dispatch = useAppDispatch();

  // get loaderData
  const { id, data } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  // set loaderData
  dispatch(totalActions.setTotalFromBudgetData(data.budget));
  dispatch(budgetCategoryActions.setCategoryFromData(data.budget.categories));
  dispatch(transactionActions.setTransactions(data.transactions));

  return (
    <>
      <BudgetHeader budgetId={id} />
      <main>
        {/* Status */}
        <Carousel id="status" initialIndex={1} itemClassName={classes.status}>
          <DateStatus budgetId={id} />
          <TotalStatus budgetId={id} />
          <CategoryStatus budgetId={id} />
        </Carousel>
        <hr />
        {/* Transactions */}
        <TransactionLayout budgetId={id} />
        {/* Overlays */}
        <CategoryPlan budgetId={id} />
      </main>
    </>
  );
}

export default Budget;

export const loader = async (data: LoaderFunctionArgs) => {
  const { params } = data;

  if (!params.budgetId) throw new Response('Budget Not Found', { status: 404 });

  return {
    id: params.budgetId,
    data: await getBudgetById(params.budgetId),
  };
};
