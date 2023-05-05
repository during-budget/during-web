import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AssetStatus from '../components/Asset/Status/AssetStatus';
import CardStatus from '../components/Asset/Status/CardStatus';
import CategoryPlan from '../components/Budget/Category/CategoryPlan';
import TransactionLayout from '../components/Budget/Transaction/TransactionLayout';
import StepNav from '../components/UI/StepNav';
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

  const data = [
    { title: '자산 설정', status: <AssetStatus assets={assets} />, list: <section /> },
    {
      title: '결제수단 설정',
      status: <CardStatus assets={assets} cards={cards} />,
      list: <section />,
    },
    {
      title: '기본예산 설정',
      status: <DefaultStatus budgetId={defaultBudgetId} />,
      list: (
        <>
          {/* Transactions */}
          <TransactionLayout budgetId={defaultBudgetId} isDefault={true} />
          {/* Overlays */}
          <CategoryPlan budgetId={defaultBudgetId} />
        </>
      ),
    },
  ];

  console.log(currentIdx, data[currentIdx]);

  const { title, status, list } = data[currentIdx];

  return (
    <div className={classes.container}>
      <header>
        <h1>{title}</h1>
      </header>
      <main>
        <div>{status}</div>
        <StepNav
          className={classes.nav}
          idx={currentIdx}
          setIdx={setCurrentIdx}
          length={data.length}
          onComplete={() => {
            alert('완료!');
          }}
        />
        <hr />
        {list}
      </main>
    </div>
  );
};

export default InitialSetting;
