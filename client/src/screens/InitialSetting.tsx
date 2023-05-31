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
import CategoryPlan from '../components/Budget/Category/CategoryPlan';
import TransactionDetail from '../components/Budget/Transaction/TransactionDetail';
import TransactionForm from '../components/Budget/Transaction/TransactionForm';
import TransactionList from '../components/Budget/Transaction/TransactionList';
import TransactionNav from '../components/Budget/Transaction/TransactionNav';
import EmojiOverlay from '../components/UI/EmojiOverlay';
import StepNav from '../components/UI/StepNav';
import DefaultStatus from '../components/User/Default/DefaultStatus';
import { useAppSelector } from '../hooks/redux-hook';
import { assetActions } from '../store/asset';
import { budgetActions } from '../store/budget';
import { budgetCategoryActions } from '../store/budget-category';
import { totalActions } from '../store/total';
import { transactionActions } from '../store/transaction';
import { uiActions } from '../store/ui';
import {
  AssetDataType,
  CardDataType,
  createAsset,
  createCard,
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
        dispatch(
          uiActions.showErrorModal({
            description: message || '기본 예산을 로드할 수 없습니다.',
          })
        );
        if (!message) throw error;
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
    {
      title: '자산 설정',
      status: <AssetStatus assets={assets} {...editorProps} />,
      list: (
        <>
          <AssetCardEditItemList
            id="asset-edit-item-list"
            isAsset={true}
            setOpen={setOpenEditor}
            setTarget={(target: AssetCardDataType) => {
              setTargetState(target);
            }}
          />
        </>
      ),
    },
    {
      title: '결제수단 설정',
      status: <CardStatus assets={assets} cards={cards} {...editorProps} />,
      list: (
        <AssetCardEditItemList
          id="card-edit-item-list"
          isAsset={false}
          setOpen={setOpenEditor}
          setTarget={(target: AssetCardDataType) => {
            setTargetState(target);
          }}
        />
      ),
    },
    {
      title: '기본예산 설정',
      status: <DefaultStatus budgetId={defaultBudgetId} />,
      list: (
        <>
          {/* Transactions */}
          <section>
            <TransactionNav id="initial_setting_layout" />
            <TransactionList isDefault={true} />
            <TransactionForm budgetId={defaultBudgetId} isDefaultBudget={true} />
          </section>
          {/* Overlays */}
          <TransactionDetail isDefaultBudget={true} />
          <CategoryPlan budgetId={defaultBudgetId} />
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

  const createHandler = async (target: AssetCardDataType, isAsset?: boolean) => {
    if (isAsset) {
      const { assets, paymentMethods } = await createAsset(
        target as Omit<AssetDataType, '_id'>
      );
      dispatch(assetActions.setAssets(assets));
      dispatch(assetActions.setPaymentMethods(paymentMethods));
    } else {
      const { cards, paymentMethods } = await createCard(
        target as Omit<CardDataType, '_id'>
      );
      dispatch(assetActions.setCards(cards));
      dispatch(assetActions.setPaymentMethods(paymentMethods));
    }
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
            navigate('/budget');
          }}
        />
        <hr />
        {list}
      </main>
      {/* Overlays */}
      {currentIdx < 2 && (
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
            updateTarget={targetState ? updateHandler : createHandler}
          />
        </>
      )}
      <EmojiOverlay />
    </>
  );
};

export default InitialSetting;
