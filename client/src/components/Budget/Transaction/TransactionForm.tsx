import { useEffect, useRef, useState } from 'react';
import AmountInput from '../Input/AmountInput';
import CategoryInput from '../Input/CategoryInput';
import DateInput from '../Input/DateInput';
import MemoInput from '../Input/MemoInput';
import EmojiInput from '../Input/EmojiInput';
import TitleInput from '../Input/TitleInput';
import PaymentInput from '../Input/PaymentInput';
import TagInput from '../Input/TagInput';
import Button from '../../UI/Button';
import ExpenseTab from '../UI/ExpenseTab';
import Overlay from '../../UI/Overlay';
import classes from './TransactionForm.module.css';
import TransactionNav from './TransactionNav';
import Transaction from '../../../models/Transaction';
import { useDispatch, useSelector } from 'react-redux';
import { transactionActions } from '../../../store/transaction';
import {
    createTransaction,
    updateTransaction,
} from '../../../util/api/transactionAPI';
import { budgetActions } from '../../../store/budget';
import { uiActions } from '../../../store/ui';
import ConfirmCancelButtons from '../../UI/ConfirmCancelButtons';
import { v4 as uuid } from 'uuid';
import { getNumericHypenDateString } from '../../../util/date';
import BudgetCategorySetting from '../Category/BudgetCategorySetting';

function TransactionForm(props: {
    budgetId: string;
    date?: { start: Date; end: Date };
    isBasic?: boolean;
}) {
    const dispatch = useDispatch();

    const { mode, default: defaultValue } = useSelector(
        (state: any) => state.transaction.form
    );
    const isCurrent = useSelector((state: any) => state.ui.budget.isCurrent);

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
            isCurrent,
            isExpense,
            icon: iconRef.current!.value() || '',
            titles: titlesRef.current!.value(),
            date: new Date(dateRef.current!.value()),
            amount: +amountRef.current!.value(),
            categoryId: categoryRef.current!.value(),
            tags: tagsRef.current!.value(),
            memo: memoRef.current!.value(),
            linkId: defaultValue.linkId || null,
            overAmount: defaultValue.overAmount || 0,
        });

        if (mode.isDone) {
            transaction.overAmount = transaction.amount - defaultValue.amount;
        }

        // send request
        if (mode.isEdit) {
            updateTransaction(transaction);
            dispatch(
                budgetActions.updateTransactionAmount({
                    budgetId,
                    prev: defaultValue,
                    next: transaction,
                })
            );
        } else {
            const { createdId, createdLinkId } = await createTransaction(
                transaction
            );
            transaction.id = createdId;
            transaction.linkId = createdLinkId;
        }

        // add linkId to scheduled
        if (mode.isDone) {
            dispatch(
                transactionActions.addLink({
                    targetId: transaction.linkId,
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

        const updatedAmount = mode.isEdit
            ? amount - defaultValue.amount
            : amount;

        // update amount status chart
        dispatch(
            budgetActions.updateTotalAmount({
                budgetId,
                isExpense,
                isCurrent,
                amount: updatedAmount,
            })
        );

        dispatch(
            budgetActions.updateCategoryAmount({
                budgetId,
                categoryId,
                isCurrent,
                amount: updatedAmount,
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
                    date: props.date ? getDefaultDate() : undefined,
                },
            })
        );
    };

    const getDefaultDate = () => {
        const { start, end } = props.date!;
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
                defaultValue={defaultValue.amount}
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
        props.isBasic ? classes.basic : '',
        mode.isExpand ? classes.expand : '',
    ].join(' ');

    return (
        <Overlay
            className={containerClass}
            isOpen={mode.isExpand}
            isClip={true}
            isShowBackdrop={true}
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
                        {!defaultValue.isDone && (
                            <div className={classes.types}>
                                <ExpenseTab
                                    id="transaction-form-expense"
                                    isExpense={isExpense}
                                    setIsExpense={setIsExpense}
                                    disabled={mode.isDone}
                                />
                                {!props.isBasic && (
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
                            className={classes.buttons}
                            onClose={closeHandler}
                        />
                    </>
                )}
            </form>
            {/* msg */}
            {props.isBasic && (
                <p className={classes.info}>
                    ⓘ 매월 반복적으로 생기는 지출/수입을 등록해보세요
                </p>
            )}
            <BudgetCategorySetting
                budgetId={props.budgetId}
                isExpense={isExpense}
                isOpen={isEditSetting}
                setIsOpen={setIsEditSetting}
                sendRequest={true}
            />
        </Overlay>
    );
}

export default TransactionForm;
