import { css } from '@emotion/react';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { v4 as uuid } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { assetActions } from '../../../store/asset';
import { budgetActions } from '../../../store/budget';
import { budgetCategoryActions } from '../../../store/budget-category';
import { totalActions } from '../../../store/total';
import { transactionActions } from '../../../store/transaction';
import { uiActions } from '../../../store/ui';
import { AssetDataType } from '../../../util/api/assetAPI';
import { BudgetDataType } from '../../../util/api/budgetAPI';
import {
  TransactionType,
  createTransaction,
  updateTransaction,
} from '../../../util/api/transactionAPI';
import PaymentEditor from '../../Asset/Editor/PaymentEditor';
import Button from '../../UI/button/Button';
import EmojiInput from '../../UI/input/EmojiInput';
import OverlayForm from '../../UI/overlay/OverlayForm';
import AmountInput from '../Input/AmountInput';
import CategoryInput from '../Input/CategoryInput';
import DateInput from '../Input/DateInput';
import DateSelector from '../Input/DateSelector';
import MemoInput from '../Input/MemoInput';
import PaymentInput from '../Input/PaymentInput';
import TagInput from '../Input/TagInput';
import TitleInput from '../Input/TitleInput';
import CurrentTab from '../UI/CurrentTab';
import ExpenseTab from '../UI/ExpenseTab';
import classes from './TransactionForm.module.css';
import AssetCardListEditor from '../../Asset/Editor/AssetCardListEditor';

interface TransactionFromProps {
  budgetId: string;
  isDefaultBudget?: boolean;
  className?: string;
}

function TransactionForm({ budgetId, isDefaultBudget, className }: TransactionFromProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // get data from store
  const { date } = useAppSelector((state) => state.budget.current);

  const { mode, default: defaultValue } = useAppSelector(
    (state) => state.transaction.form
  );

  const isCurrent = isDefaultBudget
    ? false
    : useAppSelector((state) => state.ui.budget.isCurrent);

  const isExpense = useAppSelector((state) => state.ui.budget.isExpense);
  const setIsExpense = (isExpense: boolean) => {
    dispatch(uiActions.setIsExpense(isExpense));
  };

  useEffect(() => {
    setIsExpense(defaultValue.isExpense);
  }, [defaultValue.isExpense]);

  const [iconState, setIconState] = useState('');
  const [isOpenPaymentEditor, setIsOpenPaymentEditor] = useState(false);
  const [isPaymentAsset, setIsPaymentAsset] = useState(false); // 체크
  const [paymentState, setPaymentState] = useState<string>('');
  const [dateState, setDateState] = useState<Date>(defaultValue.date || new Date());
  const [excludeAsset, setExcludeAsset] = useState(
    defaultValue.updateAsset === undefined ? false : !defaultValue.updateAsset
  );

  useEffect(() => {
    if (!mode.isDone && !mode.isEdit) {
      setPaymentState(
        defaultValue.linkedPaymentMethodId ?? localStorage.getItem('payment') ?? ''
      );
    } else {
      setPaymentState(defaultValue.linkedPaymentMethodId || '');
    }
    setDateState(defaultValue.date || new Date());
  }, [defaultValue]);

  useEffect(() => {
    setExcludeAsset(!defaultValue.updateAsset);
  }, [defaultValue.updateAsset]);

  useEffect(() => {
    if (!mode.isEdit && !mode.isDone) {
      const isLater = dayjs().endOf('day') < dayjs(dateState);
      dispatch(uiActions.setIsCurrent(!isLater));
    }
  }, [dateState]);

  const titlesRef = useRef<any>(null);
  const amountRef = useRef<any>(null);
  const categoryRef = useRef<any>(null);
  const iconRef = useRef<any>(null);
  const tagsRef = useRef<any>(null);
  const memoRef = useRef<any>(null);

  // handlers
  const submitHandler = async () => {
    // set transaction
    const transaction: TransactionType = {
      _id: defaultValue._id || uuid(),
      budgetId,
      isCurrent,
      isExpense,
      icon: iconRef.current!.value() || '',
      title: titlesRef.current!.value(),
      date: dateState || new Date(),
      amount: +amountRef.current!.value,
      categoryId: categoryRef.current!.value(),
      linkedPaymentMethodId: paymentState || '',
      tags: tagsRef.current!.value(),
      memo: memoRef.current!.value(),
      linkId: defaultValue.linkId || undefined,
      overAmount: defaultValue.overAmount,
      updateAsset: !excludeAsset,
    };

    // send request
    if (mode.isEdit) {
      const {
        transaction: transactionData,
        transactionLinked,
        budget,
        assets,
      } = await updateTransaction(transaction);

      await dispatch(
        transactionActions.updateTransactionFromData({
          id: transactionData._id,
          transactionData,
        })
      ); // NOTE: await for scroll

      dispatch(transactionActions.replaceTransactionFromData(transactionLinked));
      dispatchAmount(budget, assets);
    } else {
      const {
        transaction: createdTransaction,
        transactionScheduled,
        budget,
        assets,
      } = await createTransaction(transaction);

      await dispatch(transactionActions.addTransactionFromData(createdTransaction)); // NOTE: await for scroll

      dispatch(transactionActions.replaceTransactionFromData(transactionScheduled));
      dispatchAmount(budget, assets);
    }

    // scroll
    document
      .getElementById(transaction._id)
      ?.scrollIntoView({ block: 'center', behavior: 'smooth' });

    clearForm();
  };

  const dispatchAmount = (budget: BudgetDataType, assets: AssetDataType[]) => {
    if (budget) {
      dispatch(budgetActions.setCurrentBudget(budget));
      dispatch(totalActions.setTotalFromBudgetData(budget));
      dispatch(budgetCategoryActions.setCategoryFromData(budget.categories));
    }

    if (assets) {
      dispatch(assetActions.setAssets(assets));
    }
  };

  const expandHandler = () => {
    dispatch(
      uiActions.setAmountOverlay({
        value: defaultValue.amount ? defaultValue.amount.toString() : '',
        onConfirm: (value: string) => {
          dispatch(transactionActions.setAmount(+value));
        },
        hash: '#transaction-form',
      })
    );

    if (mode.isExpand) return;

    // set form expand
    dispatch(
      transactionActions.setForm({
        mode: { isExpand: true },
        default: {
          date: date ? getDefaultDate(date) : new Date(),
          isExpense,
        },
      })
    );

    dispatch(
      uiActions.setAmountOverlay({
        value: defaultValue.amount ? defaultValue.amount.toString() : '',
        onConfirm: (value: string) => {
          dispatch(transactionActions.setAmount(+value));
        },
        hash: '#transaction-form',
      })
    );

    // prevent scroll for scroll down when resizing
    document.getElementById('transaction-form-amount')?.focus({ preventScroll: true });
  };

  const closeHandler = () => {
    if (mode.isDone) {
      dispatch(uiActions.setIsCurrent(false));
    }
    clearForm();
  };

  const clearForm = () => {
    dispatch(transactionActions.clearForm({ isExpense }));
    amountRef.current!.clear();
  };

  const editorHandler = () => {
    dispatch(uiActions.showBudgetCategorySetting(true));
  };

  // fields
  const amountField = (
    <div className={classes.amount}>
      <AmountInput
        id="transaction-form-amount"
        ref={amountRef}
        className="w-100"
        onFocus={expandHandler}
        onClick={expandHandler}
        defaultValue={defaultValue.amount ? defaultValue.amount.toString() : ''}
        required={true}
      />
      <Button onClick={expandHandler} css={css({ width: mode.isExpand ? 0 : '40%' })}>
        내역 추가
      </Button>
    </div>
  );

  const selectField = (
    <div className={classes.selects}>
      <CategoryInput
        ref={categoryRef}
        setIsEditSetting={editorHandler}
        className={`${classes.field} ${classes.select}`}
        categoryId={defaultValue.categoryId}
        setIcon={setIconState}
        disabled={mode.isDone}
      />
      <PaymentInput
        budgetId={budgetId}
        className={`${classes.field} ${classes.select}`}
        value={paymentState || ''}
        onChange={(value: string, isCredit: boolean) => {
          setPaymentState(value);
          setExcludeAsset(isCredit);
        }}
        // defaultValue={defaultValue.linkedPaymentMethodId}
        setIsEditSetting={setIsOpenPaymentEditor}
        isAsset={isPaymentAsset}
        setIsAsset={setIsPaymentAsset}
      />
    </div>
  );

  const noteField = (
    <div className={classes.note}>
      <EmojiInput
        ref={iconRef}
        className={`${classes.field} ${classes.emoji}`}
        defaultValue={defaultValue.icon}
        placeholder={iconState}
      />
      <TitleInput
        ref={titlesRef}
        className={`${classes.field} w-100`}
        defaultValue={defaultValue.title}
      />
    </div>
  );

  const containerClass = [
    classes.transactionForm,
    location.pathname.includes('init') ? classes.init : classes,
    isDefaultBudget ? classes.basic : '',
    mode.isExpand ? classes.expand : '',
  ].join(' ');

  return (
    <>
      <OverlayForm
        className={`${containerClass} ${className}`}
        onSubmit={submitHandler}
        overlayOptions={{
          id: 'transaction-form',
          isOpen: mode.isExpand,
          onClose: closeHandler, // 여기서 문제 발생
          isClip: true,
          noTransition: true,
          isRight: true,
        }}
        formPadding="sm"
        formHeight="60vh"
      >
        {/* shortField */}
        {amountField}
        {/* expandFields */}
        {mode.isExpand && (
          <>
            {/* fields */}
            {isDefaultBudget ? (
              <DateSelector
                className={classes.select}
                value={dateState}
                onChange={setDateState}
              />
            ) : (
              <DateInput
                className={classes.dateField}
                value={dateState}
                onChange={setDateState}
                required={true}
              />
            )}
            {selectField} {/* category, payment */}
            {noteField} {/* emoji, title */}
            <TagInput ref={tagsRef} className="w-100" defaultValue={defaultValue.tags} />
            <MemoInput
              ref={memoRef}
              className={`${classes.field} ${classes.memo}`}
              defaultValue={defaultValue.memo}
            />
            {/* types */}
            {!mode.isDone && (
              <div className={classes.types}>
                <ExpenseTab id="transaction-form-expense" disabled={mode.isDone} />
                {!isDefaultBudget && (
                  <>
                    <span>|</span>
                    <CurrentTab
                      id="transaction-form-current"
                      isCurrent={defaultValue.isCurrent}
                      disabled={mode.isDone}
                    />
                  </>
                )}
              </div>
            )}
          </>
        )}
        {/* msg */}
        {isDefaultBudget && !mode.isExpand && (
          <p className={classes.info}>
            ⓘ 매월 반복적으로 생기는 지출/수입을 등록해보세요
          </p>
        )}
      </OverlayForm>
      <AssetCardListEditor
        isAsset={isPaymentAsset}
        isOpen={isOpenPaymentEditor}
        closeEditor={() => {
          setIsOpenPaymentEditor(false);
        }}
      />
    </>
  );
}

const getDefaultDate = (date: { start: Date; end: Date }) => {
  const { start, end } = date;

  const now = new Date();

  if (isNaN(start.valueOf()) || isNaN(end.valueOf())) {
    return now;
  }

  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  const biggerThanStart =
    year >= start.getFullYear() && month >= start.getMonth() && day >= start.getDate();

  const smallerThanEnd =
    year <= end.getFullYear() && month <= end.getMonth() && day <= end.getDate();

  if ((!start && !end) || (biggerThanStart && smallerThanEnd)) {
    return now;
  } else {
    return start;
  }
};

export default TransactionForm;
