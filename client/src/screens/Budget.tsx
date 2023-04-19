import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import classes from './Budget.module.css';
import { getBudgetById } from '../util/api/budgetAPI';
import Carousel from '../components/UI/Carousel';
import BudgetHeader from '../components/Budget/UI/BudgetHeader';
import TotalStatus from '../components/Budget/Status/TotalStatus';
import DateStatus from '../components/Budget/Status/DateStatus';
import CategoryStatus from '../components/Budget/Status/CategoryStatus';
import TransactionLayout from '../components/Budget/Transaction/TransactionLayout';
import { useEffect } from 'react';
import { transactionActions } from '../store/transaction';
import CategoryPlan from '../components/Budget/Category/CategoryPlan';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hook';
import { totalActions } from '../store/total';
import { budgetCategoryActions } from '../store/budget-category';

function Budget() {
  const dispatch = useAppDispatch();

  // get loaderData
  const { id, data } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  // set loaderData
  dispatch(totalActions.setTotalFromBudgetData(data.budget));
  dispatch(budgetCategoryActions.setCategoryFromBudgetData(data.budget));
  dispatch(transactionActions.setTransactions(data.transactions));

  // get budget Data
  const budgets = useAppSelector((state) => state.budget);
  const { title, date } = budgets[id];

  return (
    <>
      <BudgetHeader
        startDate={new Date(date.start)}
        endDate={new Date(date.end)}
        title={title}
      />
      <main>
        {/* Status */}
        {/* TODO: initialIndex 1로 바꾸기 */}
        <Carousel id="status" initialIndex={1} itemClassName={classes.status}>
          <DateStatus title={title} date={date} />
          <TotalStatus budgetId={id} />
          <CategoryStatus budgetId={id} />
        </Carousel>
        <hr />
        {/* Transactions */}
        <TransactionLayout budgetId={id} date={date} />
        {/* Overlays */}
        {/* <CategoryPlan
          budgetId={id}
          categories={categories}
          total={{
            expense: total.expense.planned,
            income: total.income.planned,
          }}
          title={title}
        /> */}
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
