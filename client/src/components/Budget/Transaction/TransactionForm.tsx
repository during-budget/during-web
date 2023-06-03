import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
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
import Button from '../../UI/Button';
import EmojiInput from '../../UI/EmojiInput';
import OverlayForm from '../../UI/OverlayForm';
import AmountInput from '../Input/AmountInput';
import CategoryInput from '../Input/CategoryInput';
import DateInput from '../Input/DateInput';
import MemoInput from '../Input/MemoInput';
import PaymentInput from '../Input/PaymentInput';
import TagInput from '../Input/TagInput';
import TitleInput from '../Input/TitleInput';
import CurrentTab from '../UI/CurrentTab';
import ExpenseTab from '../UI/ExpenseTab';
import classes from './TransactionForm.module.css';

interface TransactionFromProps {
  budgetId: string;
  isDefaultBudget?: boolean;
  className?: string;
}

function TransactionForm({ budgetId, isDefaultBudget, className }: TransactionFromProps) {
  const dispatch = useAppDispatch();

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
  const [paymentState, setPaymentState] = useState<string>('');
  const [dateState, setDateState] = useState<Date | null>(defaultValue.date);
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

  useEffect(() => {
    setDateState(defaultValue.date);
  }, [defaultValue.date]);

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
      date: dateState,
      amount: +amountRef.current!.value(),
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
    if (mode.isExpand) return;

    // set form expand
    dispatch(
      transactionActions.setForm({
        mode: { isExpand: true },
        default: {
          date: date ? getDefaultDate(date) : null,
          isExpense,
        },
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
        className={classes.field}
        style={{
          width: mode.isExpand ? '100%' : 0,
          padding: mode.isExpand ? 'var(--size-6)' : 0,
        }}
        onFocus={expandHandler}
        onClick={expandHandler}
        defaultValue={defaultValue.amount ? defaultValue.amount.toString() : ''}
        required={true}
      />
      <Button onClick={expandHandler} style={{ width: mode.isExpand ? 0 : '100%' }}>
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
        className={`${classes.field} ${classes.title}`}
        defaultValue={defaultValue.title}
      />
    </div>
  );

  const containerClass = [
    classes.transactionForm,
    isDefaultBudget ? classes.basic : '',
    mode.isExpand ? classes.expand : '',
  ].join(' ');

  return (
    <>
      <OverlayForm
        className={`${containerClass} ${className}`}
        onSubmit={submitHandler}
        overlayOptions={{
          isOpen: mode.isExpand,
          onClose: closeHandler,
          isClip: true,
          noTransition: true,
        }}
        formPadding="sm"
      >
        {/* shortField */}
        {amountField}
        {/* expandFields */}
        {mode.isExpand && (
          <>
            {/* fields */}
            <DateInput
              className={classes.dateField}
              value={dateState}
              onChange={setDateState}
              required={true}
            />
            {selectField} {/* category, payment */}
            {noteField} {/* emoji, title */}
            <TagInput
              ref={tagsRef}
              className={classes.field}
              defaultValue={defaultValue.tags}
            />
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
      <PaymentEditor
        isOpen={isOpenPaymentEditor}
        onClose={() => {
          setIsOpenPaymentEditor(false);
        }}
      />
    </>
  );
}

const getDefaultDate = (date: { start: Date; end: Date }) => {
  const { start, end } = date;
  const now = new Date();
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
