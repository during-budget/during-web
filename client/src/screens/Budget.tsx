import { useEffect } from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import BudgetCategorySetting from '../components/Budget/Category/BudgetCategorySetting';
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
import DefaultStatus from '../components/User/Default/DefaultStatus';
import { useAppDispatch } from '../hooks/redux-hook';
import { budgetActions } from '../store/budget';
import { budgetCategoryActions } from '../store/budget-category';
import { totalActions } from '../store/total';
import { transactionActions } from '../store/transaction';
import { BudgetDataType, getBudgetById } from '../util/api/budgetAPI';
import { TransactionDataType } from '../util/api/transactionAPI';
import classes from './Budget.module.css';

function Budget() {
  const dispatch = useAppDispatch();

  // get loaderData
  const { id, isDefaultBudget, data } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;

  // set loaderData
  useEffect(() => {
    dispatchBudgetData(data);
  }, [data]);

  const dispatchBudgetData = (data: {
    budget: BudgetDataType;
    transactions: TransactionDataType[];
  }) => {
    dispatch(budgetActions.setCurrentBudget(data.budget));
    dispatch(totalActions.setTotalFromBudgetData(data.budget));
    dispatch(budgetCategoryActions.setCategoryFromData(data.budget.categories));
    dispatch(transactionActions.setTransactions(data.transactions));
  };

  const defaultBudgetStatus = <DefaultStatus budgetId={id} />;

  const statusCarousel = (
    <Carousel id="status" initialIndex={1} itemClassName={classes.status}>
      <DateStatus budgetId={id} />
      <TotalStatus budgetId={id} />
      <CategoryStatus budgetId={id} />
    </Carousel>
  );

  return (
    <div className={classes.budget}>
      <BudgetHeader isDefault={isDefaultBudget} />
      <main>
        {/* Status */}
        {isDefaultBudget ? defaultBudgetStatus : statusCarousel}
        <hr />
        {/* Transactions */}
        <section className={classes.transactions}>
          <TransactionNav id="budget_layout" showAll={true} />
          <TransactionList className={classes.transactions} isDefault={isDefaultBudget} />
          <TransactionForm
            className={classes.form}
            budgetId={id}
            isDefaultBudget={isDefaultBudget}
          />
        </section>
      </main>
      {/* Overlays */}
      <TransactionDetail isDefaultBudget={isDefaultBudget} />
      <CategoryPlan budgetId={id} />
      <BudgetCategorySetting budgetId={id} />
      <BudgetList />
      <EmojiOverlay />
    </div>
  );
}

export default Budget;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.budgetId) throw new Error('예산을 찾기 위해 예산 id가 필요합니다.');

  return {
    id: params.budgetId,
    isDefaultBudget: params.isDefault ? true : false,
    data: await getBudgetById(params.budgetId),
  };
};
