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
import { createTransaction } from '../../../util/api/transactionAPI';
import { budgetActions } from '../../../store/budget';

function TransactionForm(props: { budgetId: string }) {
    const dispatch = useDispatch();

    const { mode, default: defaultValue } = useSelector(
        (state: any) => state.transaction.form
    );

    const [isCurrent, setIsCurrent] = useState(defaultValue.isCurrent);
    const [isExpense, setIsExpense] = useState(defaultValue.isExpense);
    const [iconState, setIconState] = useState('');

    const titlesRef = useRef<any>(null);
    const dateRef = useRef<any>(null);
    const amountRef = useRef<any>(null);
    const categoryRef = useRef<any>(null);
    const iconRef = useRef<any>(null);
    const tagsRef = useRef<any>(null);
    const memoRef = useRef<any>(null);

    const budgetId = props.budgetId;

    // handlers
    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();

        const transaction = new Transaction({
            id: defaultValue.id || (+new Date()).toString(),
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
            linkId:
                defaultValue.linkId ||
                (mode.isCompleted && defaultValue.id) ||
                null,
            linkAmount: 0,
        });

        dispatch(transactionActions.addTransaction(transaction));

        if (mode.isEdit) {
        } else {
            dispatchAddAmount(transaction);
            createTransaction(transaction);
        }
        clearForm();
    };

    const dispatchAddAmount = (transaction: Transaction) => {
        const { budgetId, isExpense, isCurrent, amount, categoryId } =
            transaction;

        dispatch(
            budgetActions.updateTotalAmount({
                budgetId,
                isExpense,
                isCurrent,
                amount,
            })
        );

        dispatch(
            budgetActions.updateCategoryAmount({
                budgetId,
                categoryId,
                isCurrent,
                amount,
            })
        );
    };

    const expandHandler = () => {
        dispatch(transactionActions.setForm({ mode: { isExpand: true } }));
    };

    const closeHandler = () => {
        clearForm();
    };

    const clearForm = () => {
        dispatch(transactionActions.clearForm());
        amountRef.current!.clear();
    };

    // disable body scroll
    useEffect(() => {
        const body = document.querySelector('body');
        if (mode.isExpand) {
            body?.style.setProperty('overflow', 'hidden');
        } else {
            body?.style.setProperty('overflow', 'scroll');
        }
    }, [mode.isExpand]);

    // fields
    const amountField = (
        <div className={classes.amount}>
            <AmountInput
                ref={amountRef}
                className={classes.field}
                onFocus={expandHandler}
                onClick={expandHandler}
                defaultValue={defaultValue.amount}
                readOnly={!mode.isExpand}
                required={true}
            />
            <Button onClick={expandHandler}>내역 추가</Button>
        </div>
    );

    const selectField = (
        <div className={classes.selects}>
            <CategoryInput
                ref={categoryRef}
                isExpense={isExpense}
                className={`${classes.field} ${classes.select}`}
                defaultValue={defaultValue.categoryId}
                onChange={() => {
                    setIconState(categoryRef.current!.icon());
                }}
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

    return (
        <Overlay
            className={`${classes.container} ${
                mode.isExpand && classes.expand
            }`}
            isOpen={mode.isExpand}
            isClip={true}
            isShowBackdrop={true}
            onClose={closeHandler}
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
                        <div className={classes.types}>
                            <ExpenseTab
                                id="transaction-form-expense"
                                isExpense={isExpense}
                                setIsExpense={setIsExpense}
                            />
                            <span>|</span>
                            <TransactionNav
                                id="transaction-form-current"
                                isCurrent={isCurrent}
                                setIsCurrent={setIsCurrent}
                            />
                        </div>
                        {/* buttons */}
                        <div className={classes.buttons}>
                            <Button
                                className={classes.cancel}
                                styleClass="extra"
                                onClick={closeHandler}
                            >
                                취소
                            </Button>
                            <Button type="submit" styleClass="primary">
                                완료
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </Overlay>
    );
}

export default TransactionForm;
