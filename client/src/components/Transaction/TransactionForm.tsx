import classes from './TransactionForm.module.css';
import { useRef, useState } from 'react';
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

function TransactionForm(props: {
    budgetId: string;
    isCurrent: boolean;
    onClickScheduled: () => void;
    onClickCurrent: () => void;
}) {
    const dispatch = useDispatch();
    const categories = useSelector((state: any) => state.categories);

    const formState = useSelector((state: any) => state.ui.transactionForm);

    const [amountState, setAmountState] = useState('');

    const titleRef = useRef<any>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);
    const tagRef = useRef<any>(null);
    const memoRef = useRef<HTMLTextAreaElement>(null);

    const expandHandler = () => {
        dispatch(uiActions.setTransactionForm({ isExpand: true }));
    };

    const cancelHandler = () => {
        setAmountState('');
        dispatch(uiActions.setTransactionForm({ isExpand: false }));
    };

    const changeAmountHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setAmountState(event.target.value);
    };

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        setAmountState('');
        dispatch(uiActions.setTransactionForm({ isExpand: false }));
        const categoryId = categoryRef.current!.value;
        const icon = titleRef.current!.icon() || categories.find((item: any) => item.id === categoryId).icon;
        dispatch(
            budgetActions.updateTotalAmount({
                budgetId: props.budgetId,
                isCurrent: props.isCurrent,
                amount: +amountState,
            })
        );
        dispatch(
            categoryActions.updateAmount({
                categoryId,
                budgetId: props.budgetId,
                isCurrent: props.isCurrent,
                amount: +amountState,
            })
        );
        dispatch(
            transactionActions.addTransaction(
                new Transaction({
                    id: new Date().toString(),
                    budgetId: props.budgetId,
                    isCurrent: props.isCurrent,
                    isExpense,
                    title: titleRef.current!.value(),
                    date: new Date(dateRef.current!.value),
                    amount: +amountState,
                    categoryId,
                    icon,
                    tags: tagRef.current!.value,
                    memo: memoRef.current!.value,
                })
            )
        );
    };

    let isExpense = true;
    const setExpense = () => {
        isExpense = true;
    };
    const setIncome = () => {
        isExpense = false;
    };

    const shortInput = (
        <div className={`input-field ${classes.short}`}>
            <input
                type="number"
                placeholder="금액을 입력하세요"
                value={amountState}
                onChange={changeAmountHandler}
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

    const expandInput = (
        <div className={classes.expand}>
            <TransactionNav
                isCurrent={props.isCurrent}
                onClickScheduled={props.onClickScheduled}
                onClickCurrent={props.onClickCurrent}
            />
            <div className={classes.inputs}>
                <div className="input-field">
                    <label>금액</label>
                    <input
                        type="number"
                        onChange={changeAmountHandler}
                        value={amountState}
                        autoFocus
                    />
                </div>
                <TitleInput ref={titleRef} />
                <div className="input-field">
                    <label>날짜</label>
                    <input
                        type="date"
                        ref={dateRef}
                        defaultValue={formState.input.date}
                    />
                </div>
                <div className={classes.selects}>
                    <CategoryInput
                        ref={categoryRef}
                        categories={categories}
                        budgetId={props.budgetId}
                    />
                    <TagInput ref={tagRef} />
                </div>
                <div className="input-field">
                    <label>메모</label>
                    <textarea rows={2} ref={memoRef} />
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
                <button
                    className={`button__primary ${classes.submit}`}
                    onClick={setIncome}
                    type="submit"
                >
                    수입 내역 추가
                </button>
                <button
                    className={`button__primary ${classes.submit}`}
                    onClick={setExpense}
                    type="submit"
                >
                    지출 내역 추가
                </button>
            </div>
        </div>
    );

    return (
        <OverlayForm
            onSubmit={submitHandler}
            isShowBackdrop={formState.isExpand}
        >
            {formState.isExpand ? expandInput : shortInput}
        </OverlayForm>
    );
}

export default TransactionForm;
