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
import { getNumericHypenDateString } from '../../../util/date';
import PaymentEditor from '../../Asset/Editor/PaymentEditor';
import Button from '../../UI/Button';
import ConfirmCancelButtons from '../../UI/ConfirmCancelButtons';
import EmojiInput from '../../UI/EmojiInput';
import Overlay from '../../UI/Overlay';
import BudgetCategorySetting from '../Category/BudgetCategorySetting';
import AmountInput from '../Input/AmountInput';
import CategoryInput from '../Input/CategoryInput';
import DateInput from '../Input/DateInput';
import MemoInput from '../Input/MemoInput';
import PaymentInput from '../Input/PaymentInput';
import TagInput from '../Input/TagInput';
import TitleInput from '../Input/TitleInput';
import ExpenseTab from '../UI/ExpenseTab';
import classes from './TransactionForm.module.css';
import TransactionNav from './TransactionNav';

function TransactionForm(props: { budgetId: string; isDefault?: boolean }) {
  const dispatch = useAppDispatch();

  // get budget Data
  const { date } = useAppSelector((state) => state.budget.current);

  const { mode, default: defaultValue } = useAppSelector(
    (state) => state.transaction.form
  );
  const isCurrent = props.isDefault
    ? false
    : useAppSelector((state) => state.ui.budget.isCurrent);
  const isDefault = props.isDefault;

  const [isExpense, setIsExpense] = useState(defaultValue.isExpense);
  const [iconState, setIconState] = useState('');

  const [isOpenCategorySetting, setIsOpenCategorySetting] = useState(false);
  const [isOpenPaymentEditor, setIsOpenPaymentEditor] = useState(false);

  const [paymentState, setPaymentState] = useState<string | undefined>(undefined);

  const titlesRef = useRef<any>(null);
  const dateRef = useRef<any>(null);
  const amountRef = useRef<any>(null);
  const excludeAssetRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<any>(null);
  const paymentRef = useRef<any>(null);
  const iconRef = useRef<any>(null);
  const tagsRef = useRef<any>(null);
  const memoRef = useRef<any>(null);

  const budgetId = props.budgetId;

  // handlers
  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    // set transaction
    const transaction: TransactionType = {
      _id: defaultValue._id || uuid(),
      budgetId,
      isCurrent,
      isExpense,
      icon: iconRef.current!.value() || '',
      title: titlesRef.current!.value(),
      date: new Date(dateRef.current!.value()),
      amount: +amountRef.current!.value(),
      categoryId: categoryRef.current!.value(),
      linkedPaymentMethodId: paymentState || '',
      tags: tagsRef.current!.value(),
      memo: memoRef.current!.value(),
      linkId: defaultValue.linkId || undefined,
      overAmount: defaultValue.overAmount,
      updateAsset: excludeAssetRef.current ? !excludeAssetRef.current.checked : false,
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
      transactionActions.setForm({
        mode: { isExpand: true },
        default: {
          date: date ? getDefaultDate(date) : null,
        },
      })
    );
  };

  const closeHandler = () => {
    if (mode.isDone) {
      dispatch(uiActions.setIsCurrent(false));
    }
    clearForm();
  };

  const clearForm = () => {
    dispatch(transactionActions.clearForm());
    amountRef.current!.clear();
  };

  // NOTE: For scroll on focus
  useEffect(() => {
    const inputs: NodeListOf<HTMLElement> = document.querySelectorAll(
      `.${classes.field}`
    );
    const selects: NodeListOf<HTMLElement> = document.querySelectorAll(
      `.${classes.select}`
    );

    inputs.forEach((input) => {
      input.addEventListener('focus', () => {
        input.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
    });

    selects.forEach((select) => {
      select.addEventListener('click', () => {
        select.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
    });
  });

  // fields
  const amountField = (
    <div className={classes.amount}>
      <AmountInput
        ref={amountRef}
        className={classes.field}
        onFocus={expandHandler}
        onClick={expandHandler}
        defaultValue={defaultValue.amount ? defaultValue.amount.toString() : ''}
        required={true}
      />
      <Button onClick={expandHandler}>내역 추가</Button>
    </div>
  );

  const amountOptionFields = (
    <div className={classes.options}>
      {isCurrent && (paymentState || defaultValue.linkedPaymentMethodId) && (
        <div className={classes.option}>
          <input
            ref={excludeAssetRef}
            id={`check-exclude-asset`}
            className={classes.check}
            type="checkbox"
            defaultChecked={!defaultValue.updateAsset}
          />
          <label htmlFor={`check-exclude-asset`}>자산 합계에서 제외</label>
        </div>
      )}
      {/* <div className={classes.option}>
        <input
          ref={autoConvertRef}
          id={`auto-convert-to-current`}
          className={classes.check}
          type="checkbox"
          defaultChecked={false}
        />
        <label htmlFor={`auto-convert-to-current`}>거래 내역으로 자동 전환</label>
      </div> */}
    </div>
  );

  const selectField = (
    <div className={classes.selects}>
      <CategoryInput
        ref={categoryRef}
        budgetId={budgetId}
        isExpense={isExpense}
        setIsExpense={setIsExpense}
        setIsEditSetting={setIsOpenCategorySetting}
        className={`${classes.field} ${classes.select}`}
        defaultValue={defaultValue.categoryId}
        onChange={() => {
          setIconState(categoryRef.current!.icon());
        }}
        disabled={mode.isDone}
      />
      <PaymentInput
        ref={paymentRef}
        budgetId={budgetId}
        className={`${classes.field} ${classes.select}`}
        value={paymentState || ''}
        onChange={(value?: string, isCredit?: boolean) => {
          setPaymentState(value);
          if (excludeAssetRef.current)
            excludeAssetRef.current.checked = isCredit ? true : false;
        }}
        defaultValue={defaultValue.linkedPaymentMethodId}
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
    isDefault ? classes.basic : '',
    mode.isExpand ? classes.expand : '',
  ].join(' ');

  return (
    <>
      <Overlay
        className={containerClass}
        isOpen={mode.isExpand}
        isClip={true}
        closeHandler={closeHandler}
      >
        <form onSubmit={submitHandler}>
          {/* shortField */}
          {amountField}
          {/* expandFields */}
          {mode.isExpand && (
            <>
              {/* fields */}
              <DateInput
                ref={dateRef}
                className={classes.dateField}
                defaultValue={
                  defaultValue.date ? getNumericHypenDateString(defaultValue.date) : ''
                }
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
              {amountOptionFields}
              {/* types */}
              {!mode.isDone && (
                <div className={classes.types}>
                  <ExpenseTab
                    id="transaction-form-expense"
                    isExpense={isExpense}
                    setIsExpense={setIsExpense}
                    disabled={mode.isDone}
                  />
                  {!isDefault && (
                    <>
                      <span>|</span>
                      <TransactionNav
                        id="transaction-form-current"
                        disabled={mode.isDone}
                      />
                    </>
                  )}
                </div>
              )}
              {/* buttons */}
              <ConfirmCancelButtons
                isClose={!mode.isExpand}
                className={classes.buttons}
                onClose={closeHandler}
              />
            </>
          )}
        </form>
        {/* msg */}
        {isDefault && !mode.isExpand && (
          <p className={classes.info}>
            ⓘ 매월 반복적으로 생기는 지출/수입을 등록해보세요
          </p>
        )}
      </Overlay>
      <BudgetCategorySetting
        budgetId={props.budgetId}
        isExpense={isExpense}
        isOpen={isOpenCategorySetting}
        closeHandler={() => {
          setIsOpenCategorySetting(false);
        }}
        sendRequest={true}
      />
      <PaymentEditor
        isOpen={isOpenPaymentEditor}
        closeHandler={() => {
          setIsOpenPaymentEditor(false);
        }}
      />
    </>
  );
}

const getDefaultDate = (date: { start: Date; end: Date }) => {
  const { start, end } = date;
  const now = new Date();

  if ((!start && !end) || (start <= now && now <= end)) {
    return now;
  } else {
    return start;
  }
};

export default TransactionForm;
