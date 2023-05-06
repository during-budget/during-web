import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AssetCardEditor from '../components/Asset/Editor/AssetCardEditor';
import { AssetCardDataType } from '../components/Asset/Editor/AssetCardListEditor';
import AssetStatus from '../components/Asset/Status/AssetStatus';
import CardStatus from '../components/Asset/Status/CardStatus';
import CategoryPlan from '../components/Budget/Category/CategoryPlan';
import TransactionLayout from '../components/Budget/Transaction/TransactionLayout';
import StepNav from '../components/UI/StepNav';
import DefaultStatus from '../components/User/Default/DefaultStatus';
import { useAppSelector } from '../hooks/redux-hook';
import { assetActions } from '../store/asset';
import { budgetActions } from '../store/budget';
import { budgetCategoryActions } from '../store/budget-category';
import { totalActions } from '../store/total';
import { transactionActions } from '../store/transaction';
import {
  AssetDataType,
  CardDataType,
  createAsset,
  createCard,
} from '../util/api/assetAPI';
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
  const [openEditor, setOpenEditor] = useState(false);

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

  const openEditorHandler = () => {
    setOpenEditor(true);
  };

  const closeEditorHandler = () => {
    setOpenEditor(false);
  };

  const submitHandler = async (target: AssetCardDataType, isAsset?: boolean) => {
    if (isAsset) {
      const assets = await createAsset(target as Omit<AssetDataType, '_id'>);
      dispatch(assetActions.setAssets(assets));
    } else {
      const cards = await createCard(target as Omit<CardDataType, '_id'>);
      dispatch(assetActions.setCards(cards));
    }
  };

  const { title, status, list } = data[currentIdx];

  return (
    <>
      <header className={classes.header}>
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
      {currentIdx < 2 && (
        <AssetCardEditor
          isAsset={currentIdx === 0}
          isOpen={openEditor}
          closeEditor={closeEditorHandler}
          openEditor={openEditorHandler}
          updateTarget={submitHandler}
          isAdd={true}
        />
      )}
    </>
  );
};

export default InitialSetting;
