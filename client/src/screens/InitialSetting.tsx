import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AssetStatus from '../components/Asset/Status/AssetStatus';
import CardStatus from '../components/Asset/Status/CardStatus';
import CategoryPlan from '../components/Budget/Category/CategoryPlan';
import TransactionLayout from '../components/Budget/Transaction/TransactionLayout';
import DefaultStatus from '../components/User/Default/DefaultStatus';
import { useAppSelector } from '../hooks/redux-hook';
import { budgetActions } from '../store/budget';
import { budgetCategoryActions } from '../store/budget-category';
import { totalActions } from '../store/total';
import { transactionActions } from '../store/transaction';
import { getBudgetById } from '../util/api/budgetAPI';
import classes from './InitialSetting.module.css';

const InitialSetting = () => {
  const dispatch = useDispatch();

  const { assets, cards } = useAppSelector((state) => state.asset);
  const defaultBudgetId = useAppSelector((state) => state.user.info.defaultBudgetId);

  useEffect(() => {
    const setDefaultBudget = async () => {
      const { budget, transactions } = await getBudgetById(defaultBudgetId);

      dispatch(budgetActions.setCurrentBudget(budget));
      dispatch(totalActions.setTotalFromBudgetData(budget));
      dispatch(budgetCategoryActions.setCategoryFromData(budget.categories));
      dispatch(transactionActions.setTransactions(transactions));
    };
    setDefaultBudget();
  }, []);

  const [currentIdx, setCurrentIdx] = useState(0);

  const titles = ['자산 설정', '결제수단 설정', '기본예산 설정'];

  const status = [
    <AssetStatus assets={assets} />,
    <CardStatus assets={assets} cards={cards} />,
    <DefaultStatus budgetId={defaultBudgetId} />,
  ];

  const lists = [
    <section />,
    <section />,
    <>
      {/* Transactions */}
      <TransactionLayout budgetId={defaultBudgetId} isDefault={true} />
      {/* Overlays */}
      <CategoryPlan budgetId={defaultBudgetId} />
    </>,
  ];

  return (
    <div className={classes.container}>
      <header>
        <h1>{titles[currentIdx]}</h1>
      </header>
      <main>
        {status[currentIdx]}
        <nav></nav>
        <hr />
        {lists[currentIdx]}
      </main>
    </div>
  );
};

export default InitialSetting;
