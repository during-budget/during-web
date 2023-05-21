import { useEffect } from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import CategoryPlan from '../components/Budget/Category/CategoryPlan';
import BudgetList from '../components/Budget/List/BudgetList';
import CategoryStatus from '../components/Budget/Status/CategoryStatus';
import DateStatus from '../components/Budget/Status/DateStatus';
import TotalStatus from '../components/Budget/Status/TotalStatus';
import TransactionDetail from '../components/Budget/Transaction/TransactionDetail';
import TransactionForm from '../components/Budget/Transaction/TransactionForm';
import TransactionList from '../components/Budget/Transaction/TransactionList';
import TransactionNav from '../components/Budget/Transaction/TransactionNav';
import BudgetHeader from '../components/Budget/UI/BudgetHeader';
import Carousel from '../components/UI/Carousel';
import EmojiOverlay from '../components/UI/EmojiOverlay';
import Modal from '../components/UI/Modal';
import DefaultStatus from '../components/User/Default/DefaultStatus';
import { useAppDispatch } from '../hooks/redux-hook';
import { budgetActions } from '../store/budget';
import { budgetCategoryActions } from '../store/budget-category';
import { totalActions } from '../store/total';
import { transactionActions } from '../store/transaction';
import { getBudgetById } from '../util/api/budgetAPI';
import classes from './Budget.module.css';

function Budget() {
  const dispatch = useAppDispatch();

  // get loaderData
  const { id, isDefaultBudget, data } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;

  // set loaderData
  useEffect(() => {
    dispatch(budgetActions.setCurrentBudget(data.budget));
    dispatch(totalActions.setTotalFromBudgetData(data.budget));
    dispatch(budgetCategoryActions.setCategoryFromData(data.budget.categories));
    dispatch(transactionActions.setTransactions(data.transactions));
  }, [data]);

  const defaultBudgetStatus = <DefaultStatus budgetId={id} />;

  const statusCarousel = (
    <Carousel id="status" initialIndex={1} itemClassName={classes.status}>
      <DateStatus budgetId={id} />
      <TotalStatus budgetId={id} />
      <CategoryStatus budgetId={id} />
    </Carousel>
  );

  return (
    <>
      <BudgetHeader isDefault={isDefaultBudget} />
      <main>
        {/* Status */}
        {isDefaultBudget ? defaultBudgetStatus : statusCarousel}
        <hr />
        {/* Transactions */}
        <section>
          <TransactionNav id="budget_layout" isAll={true} />
          <TransactionList isDefault={isDefaultBudget} />
          <TransactionForm budgetId={id} isDefaultBudget={isDefaultBudget} />
        </section>
        {/* Overlays */}
        <TransactionDetail isDefaultBudget={isDefaultBudget} />
        <CategoryPlan budgetId={id} />
        <BudgetList />
        <EmojiOverlay />
      </main>
      <Modal />
    </>
  );
}

export default Budget;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.budgetId) throw new Response('Budget Not Found', { status: 404 });

  return {
    id: params.budgetId,
    isDefaultBudget: params.isDefault ? true : false,
    data: await getBudgetById(params.budgetId),
  };
};
