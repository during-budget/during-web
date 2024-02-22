import * as Sentry from '@sentry/browser';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import AssetCardEditItemList from '../components/Asset/Editor/AssetCardEditItemList';
import AssetCardItemEditor from '../components/Asset/Editor/AssetCardItemEditor';
import AssetCardListEditor, {
  AssetCardDataType,
} from '../components/Asset/Editor/AssetCardListEditor';
import AssetStatus from '../components/Asset/Status/AssetStatus';
import CardStatus from '../components/Asset/Status/CardStatus';
import BudgetCategorySetting from '../components/Budget/Category/BudgetCategorySetting';
import CategoryPlan from '../components/Budget/Category/CategoryPlan';
import TransactionDetail from '../components/Budget/Transaction/TransactionDetail';
import TransactionForm from '../components/Budget/Transaction/TransactionForm';
import TransactionList from '../components/Budget/Transaction/TransactionList';
import TransactionNav from '../components/Budget/Transaction/TransactionNav';
import StepNav from '../components/UI/nav/StepNav';
import EmojiOverlay from '../components/UI/overlay/EmojiOverlay';
import DefaultStatus from '../components/User/Default/DefaultStatus';
import { useAppSelector } from '../hooks/useRedux';
import { assetActions } from '../store/asset';
import { budgetActions } from '../store/budget';
import { budgetCategoryActions } from '../store/budget-category';
import { totalActions } from '../store/total';
import { transactionActions } from '../store/transaction';
import {
  AssetDataType,
  CardDataType,
  updateAssetById,
  updateCardById,
} from '../util/api/assetAPI';
import { getBudgetById } from '../util/api/budgetAPI';
import { getErrorMessage } from '../util/error';
import classes from './InitialSetting.module.css';

const InitialSetting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { assets, cards } = useAppSelector((state) => state.asset);
  const defaultBudgetId = useAppSelector((state) => state.user.info.defaultBudgetId);
  
  useEffect(() => {
    const setDefaultBudget = async () => {
      try {
        const { budget, transactions } = await getBudgetById(defaultBudgetId);

        if (budget) {
          dispatch(budgetActions.setCurrentBudget(budget));
          dispatch(totalActions.setTotalFromBudgetData(budget));
          dispatch(budgetCategoryActions.setCategoryFromData(budget.categories));
        }

        if (transactions) {
          dispatch(transactionActions.setTransactions(transactions));
        }
      } catch (error) {
        const message = getErrorMessage(error);
        Sentry.captureMessage(message || 'Initial Setting - 반복예산 로드 불가');
      }
    };

    setDefaultBudget();
  }, []);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [openListEditor, setOpenListEditor] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const [targetState, setTargetState] = useState<AssetCardDataType | undefined>(
    undefined
  );

  const editorProps = {
    openListEditor: () => {
      setOpenListEditor(true);
    },
    openEditor: () => {
      setOpenEditor(true);
    },
  };

  const data = [
    // {
    //   title: '자산 설정',
    //   status: (
    //     <div className={classes.status}>
    //       <AssetStatus assets={assets} {...editorProps} />
    //     </div>
    //   ),
    //   list: (
    //     <div className={classes.asset}>
    //       <AssetCardEditItemList
    //         id="asset-edit-item-list"
    //         isAsset={true}
    //         setOpen={setOpenEditor}
    //         setTarget={(target?: AssetCardDataType) => {
    //           setTargetState(target);
    //         }}
    //       />
    //       <div className={classes.polyfill} />
    //     </div>
    //   ),
    // },
    // {
    //   title: '결제수단 설정',
    //   status: (
    //     <div className={classes.status}>
    //       <CardStatus
    //         assets={assets.filter((item) => item.detail === 'account')}
    //         cards={cards}
    //         {...editorProps}
    //       />
    //     </div>
    //   ),
    //   list: (
    //     <div className={classes.card}>
    //       <AssetCardEditItemList
    //         id="card-edit-item-list"
    //         isAsset={false}
    //         setOpen={setOpenEditor}
    //         setTarget={(target?: AssetCardDataType) => {
    //           setTargetState(target);
    //         }}
    //       />
    //       <div className={classes.polyfill} />
    //     </div>
    //   ),
    // },
    {
      title: '반복예산 설정',
      status: (
        <div className={classes.default}>
          <DefaultStatus budgetId={defaultBudgetId} />
        </div>
      ),
      list: (
        <>
          {/* Transactions */}
          <section className={classes.transactions}>
            <TransactionNav id="initial_setting_layout" />
            <TransactionList isDefault={true} />
            <TransactionForm
              className={classes.form}
              budgetId={defaultBudgetId}
              isDefaultBudget={true}
            />
          </section>
          {/* Overlays */}
          <TransactionDetail isDefaultBudget={true} />
          <CategoryPlan budgetId={defaultBudgetId} />
          <BudgetCategorySetting budgetId={defaultBudgetId} />
        </>
      ),
    },
  ];

  const openEditorHandler = async () => {
    await setTargetState(undefined);
    setOpenEditor(true);
  };

  const closeEditorHandler = () => {
    setOpenEditor(false);
    setTargetState(undefined);
  };

  const updateHandler = async (target: AssetCardDataType, isAsset?: boolean) => {
    if (isAsset) {
      const { assets } = await updateAssetById(target as AssetDataType);
      dispatch(assetActions.setAssets(assets));
    } else {
      const { cards } = await updateCardById(target as CardDataType);
      dispatch(assetActions.setCards(cards));
    }
  };

  const { title, status, list } = data[currentIdx];

  return (
    <div className={`${classes.init} ${currentIdx === data.length - 1 ? classes.basic : ''}`}>
      <div className={classes.content}>
        <header>
          <h1>{title}</h1>
        </header>
        <main>
          <div className={classes.main}>
            {status}
            <hr />
            {list}
          </div>
        </main>
      </div>
      <StepNav
        className={classes.nav}
        idx={currentIdx}
        setIdx={setCurrentIdx}
        length={data.length}
        onComplete={() => {
          navigate('/budget');
        }}
      />
      {/* Overlays */}
      {currentIdx < data.length - 1 && (
        <>
          <AssetCardListEditor
            isAsset={currentIdx === 0}
            isOpen={openListEditor}
            closeEditor={() => {
              setOpenListEditor(false);
            }}
          />
          <AssetCardItemEditor
            id="add"
            isAsset={currentIdx === 0}
            isOpen={openEditor}
            target={targetState}
            closeEditor={closeEditorHandler}
            openEditor={openEditorHandler}
            updateTarget={targetState ? updateHandler : undefined}
          />
        </>
      )}
      <EmojiOverlay />
    </div>
  );
};

export default InitialSetting;
