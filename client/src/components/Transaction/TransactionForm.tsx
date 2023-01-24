import classes from './TransactionForm.module.css';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OverlayForm from '../UI/form/OverlayForm';
import TransactionNav from './TransactionNav';
import Transaction from '../../models/Transaction';
import { budgetActions } from '../../store/budget';
import { categoryActions } from '../../store/category';
import { transactionActions } from '../../store/transaction';
import { uiActions } from '../../store/ui';
import CategoryInput from '../UI/input/CategoryInput';
import TitleInput from '../UI/input/TitleInput';
import TagInput from '../UI/input/TagInput';

function TransactionForm(props: { budgetId: string }) {
    const dispatch = useDispatch();

    const categories = useSelector((state: any) => state.categories);
    const formState = useSelector((state: any) => state.ui.transactionForm);

    const shortAmountRef = useRef<HTMLInputElement>(null);
    const expandAmountRef = useRef<HTMLInputElement>(null);
    const titleRef = useRef<any>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);
    const tagRef = useRef<any>(null);
    const memoRef = useRef<HTMLTextAreaElement>(null);

    const expandHandler = () => {
        dispatch(
            uiActions.setTransactionForm({
                isEdit: false,
                isExpand: true,
                input: { amount: shortAmountRef.current!.value },
            })
        );
    };

    const cancelHandler = () => {
        dispatch(uiActions.setTransactionForm({ isExpand: false }));
    };

    const submit = (option: { isExpense: boolean }) => {
        dispatch(uiActions.setTransactionForm({ isExpand: false }));
        const categoryId = categoryRef.current!.value;
        const icon =
            titleRef.current!.icon() ||
            categories.find((item: any) => item.id === categoryId).icon;

        // update amount
        dispatch(
            budgetActions.updateTotalAmount({
                budgetId: props.budgetId,
                isCurrent: formState.isCurrent,
                amount: +expandAmountRef.current!.value,
            })
        );
        dispatch(
            categoryActions.updateAmount({
                categoryId,
                budgetId: props.budgetId,
                isCurrent: formState.isCurrent,
                amount: +expandAmountRef.current!.value,
            })
        );

        // add or update transaction
        const newId = (+new Date()).toString();
        dispatch(
            transactionActions.addTransaction(
                new Transaction({
                    id: formState.isCompleted ? newId : formState.id || newId,
                    budgetId: props.budgetId,
                    linkId: formState.linkId || (formState.isCompleted && formState.id),
                    isCurrent: formState.isCurrent,
                    isExpense: option.isExpense,
                    title: titleRef.current!.value(),
                    date: new Date(dateRef.current!.value),
                    amount: +expandAmountRef.current!.value,
                    categoryId,
                    icon,
                    tags: tagRef.current!.value,
                    memo: memoRef.current!.value,
                })
            )
        );
        if (formState.isCompleted) {
            dispatch(transactionActions.addLink({
                targetId: formState.id,
                linkId: newId,
            }));
        }

        // reset form UI
        dispatch(uiActions.resetTransactionForm());
    };

    const submitExpenseHandler = (event: React.FormEvent) => {
        event.preventDefault();
        submit({ isExpense: true });
    };
    const submitIncomeHandler = (event: React.FormEvent) => {
        event.preventDefault();
        submit({ isExpense: false });
    };

    const shortInput = (
        <div className={`input-field ${classes.short}`}>
            <input
                ref={shortAmountRef}
                type="number"
                placeholder="금액을 입력하세요"
                onKeyUp={(event: React.KeyboardEvent) => {
                    if (event.key === 'Enter') {
                        expandHandler();
                    }
                }}
            />
            <button
                className="button__primary"
                type="button"
                onClick={expandHandler}
            >
                내역추가
            </button>
        </div>
    );

    const submitButton = formState.isEdit ? (
        <button
            className={`button__primary ${classes.submit}`}
            type="submit"
            onClick={() => {
                submit({ isExpense: formState.isExpense });
            }}
        >
            완료
        </button>
    ) : (
        <>
            <button
                className={`button__primary ${classes.submit}`}
                type="submit"
                onClick={submitIncomeHandler}
            >
                수입 내역 추가
            </button>
            <button
                className={`button__primary ${classes.submit}`}
                type="submit"
                onClick={submitExpenseHandler}
            >
                지출 내역 추가
            </button>
        </>
    );

    const expandInput = (
        <div className={classes.expand}>
            <TransactionNav
                id="form"
                isExpand={true}
                isCompleted={formState.isCompleted}
            />
            <div className={classes.inputs}>
                <div className="input-field">
                    <label>금액</label>
                    <input
                        ref={expandAmountRef}
                        type="number"
                        defaultValue={formState.input.amount}
                        autoFocus
                    />
                </div>
                <TitleInput
                    ref={titleRef}
                    defaultIcon={formState.input.icon}
                    defaultTitle={formState.input.title}
                />
                <div className="input-field">
                    <label>날짜</label>
                    <input
                        type="date"
                        ref={dateRef}
                        defaultValue={
                            formState.input.date ||
                            new Date().toLocaleDateString('sv-Se')
                        }
                    />
                </div>
                <div className={classes.selects}>
                    <CategoryInput
                        ref={categoryRef}
                        categories={categories}
                        budgetId={props.budgetId}
                        defaultValue={formState.input.categoryId}
                    />
                    <TagInput
                        ref={tagRef}
                        defaultValue={formState.input.tags}
                    />
                </div>
                <div className="input-field">
                    <label>메모</label>
                    <textarea
                        rows={2}
                        ref={memoRef}
                        defaultValue={formState.input.memo}
                    />
                </div>
            </div>
            <div className={classes.buttons}>
                <button
                    className={classes.cancel}
                    type="button"
                    onClick={cancelHandler}
                >
                    취소
                </button>
                {submitButton}
            </div>
        </div>
    );

    return (
        <>
            {formState.isExpand && (
                <div className={classes.outside} onClick={cancelHandler}></div>
            )}
            <OverlayForm isShowBackdrop={formState.isExpand}>
                {formState.isExpand ? expandInput : shortInput}
            </OverlayForm>
        </>
    );
}

export default TransactionForm;
