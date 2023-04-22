import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import Transaction from '../../../models/Transaction';
import { budgetCategoryActions } from '../../../store/budget-category';
import { totalActions } from '../../../store/total';
import { transactionActions } from '../../../store/transaction';
import { uiActions } from '../../../store/ui';
import { createTransaction, updateTransaction } from '../../../util/api/transactionAPI';
import { getNumericHypenDateString } from '../../../util/date';
import { getCurrentKey } from '../../../util/filter';
import Button from '../../UI/Button';
import ConfirmCancelButtons from '../../UI/ConfirmCancelButtons';
import Overlay from '../../UI/Overlay';
import BudgetCategorySetting from '../Category/BudgetCategorySetting';
import AmountInput from '../Input/AmountInput';
import CategoryInput from '../Input/CategoryInput';
import DateInput from '../Input/DateInput';
import EmojiInput from '../Input/EmojiInput';
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
  const budgets = useAppSelector((state) => state.budget);
  const { date } = budgets[props.budgetId];

  const { mode, default: defaultValue } = useAppSelector(
    (state) => state.transaction.form
  );
  const isCurrent = useAppSelector((state) => state.ui.budget.isCurrent);
  const isDefault = props.isDefault;

  const [isExpense, setIsExpense] = useState(defaultValue.isExpense);
  const [iconState, setIconState] = useState('');
  const [isEditSetting, setIsEditSetting] = useState(false);

  const titlesRef = useRef<any>(null);
  const dateRef = useRef<any>(null);
  const amountRef = useRef<any>(null);
  const categoryRef = useRef<any>(null);
  const iconRef = useRef<any>(null);
  const tagsRef = useRef<any>(null);
  const memoRef = useRef<any>(null);

  const budgetId = props.budgetId;

  // handlers
  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    // set transaction
    const transaction = new Transaction({
      id: defaultValue.id || uuid(),
      budgetId,
      isCurrent: isDefault ? false : isCurrent,
      isExpense,
      icon: iconRef.current!.value() || '',
      titles: titlesRef.current!.value(),
      date: new Date(dateRef.current!.value()),
      amount: +amountRef.current!.value(),
      categoryId: categoryRef.current!.value(),
      tags: tagsRef.current!.value(),
      memo: memoRef.current!.value(),
      linkId: defaultValue.linkId || undefined,
      overAmount: defaultValue.overAmount,
    });

    if (mode.isDone) {
      transaction.overAmount = transaction.amount - defaultValue.amount;
    }

    // send request
    if (mode.isEdit) {
      const { transaction: transactionData } = await updateTransaction(transaction);
      dispatch(
        transactionActions.updateTransactionFromData({
          id: transactionData._id,
          transactionData,
        })
      );
    } else {
      const { transaction: createdTransaction } = await createTransaction(transaction);
      transaction.id = createdTransaction._id;
      transaction.linkId = createdTransaction.linkId || undefined;
    }

    // add linkId to scheduled
    if (mode.isDone) {
      dispatch(
        transactionActions.addLink({
          targetId: transaction.linkId!,
          linkId: transaction.id,
        })
      );
    }

    // add or replace
    await dispatch(transactionActions.addTransaction(transaction)); // NOTE: await for scroll
    dispatchAmount(transaction);

    // scroll
    document
      .getElementById(transaction.id)
      ?.scrollIntoView({ block: 'center', behavior: 'smooth' });

    clearForm();
  };

  const dispatchAmount = (transaction: Transaction) => {
    const { id, amount, categoryId, linkId } = transaction;

    const key = getCurrentKey(isCurrent);
    const updatedAmount = mode.isEdit ? amount - defaultValue.amount : amount;

    // update amount status chart
    dispatch(
      totalActions.updateTotalAmount({
        isExpense,
        [key]: updatedAmount,
      })
    );

    dispatch(
      budgetCategoryActions.updateCategoryAmount({
        categoryId,
        [key]: updatedAmount,
      })
    );

    // update overAmount
    if (mode.isEdit && linkId) {
      dispatch(
        transactionActions.updateOverAmount({
          id: isCurrent ? id : linkId,
          amount: isCurrent ? updatedAmount : -updatedAmount,
        })
      );
    }
  };

  const expandHandler = () => {
    dispatch(
      transactionActions.setForm({
        mode: { isExpand: true },
        default: {
          date: date ? getDefaultDate() : undefined,
        },
      })
    );
  };

  const getDefaultDate = () => {
    const { start, end } = date!;
    const now = new Date();

    if ((!start && !end) || (start <= now && now <= end)) {
      return getNumericHypenDateString(now);
    } else {
      return getNumericHypenDateString(start);
    }
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

  const selectField = (
    <div className={classes.selects}>
      <CategoryInput
        ref={categoryRef}
        budgetId={budgetId}
        isExpense={isExpense}
        setIsExpense={setIsExpense}
        setIsEditSetting={setIsEditSetting}
        className={`${classes.field} ${classes.select}`}
        defaultValue={defaultValue.categoryId}
        onChange={() => {
          setIconState(categoryRef.current!.icon());
        }}
        disabled={mode.isDone}
      />
      <PaymentInput className={`${classes.field} ${classes.select}`} />
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
        defaultValue={defaultValue.titles}
      />
    </div>
  );

  const containerClass = [
    classes.container,
    isDefault ? classes.basic : '',
    mode.isExpand ? classes.expand : '',
  ].join(' ');

  return (
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
              className={classes.field}
              defaultValue={defaultValue.date}
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
              className={classes.field}
              defaultValue={defaultValue.memo}
            />
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
            <ConfirmCancelButtons className={classes.buttons} onClose={closeHandler} />
          </>
        )}
      </form>
      {/* msg */}
      {isDefault && (
        <p className={classes.info}>ⓘ 매월 반복적으로 생기는 지출/수입을 등록해보세요</p>
      )}
      {/* <BudgetCategorySetting
        budgetId={props.budgetId}
        isExpense={isExpense}
        isOpen={isEditSetting}
        setIsOpen={setIsEditSetting}
        sendRequest={true}
      /> */}
    </Overlay>
  );
}

export default TransactionForm;
