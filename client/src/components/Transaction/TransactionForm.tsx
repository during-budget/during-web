import classes from './TransactionForm.module.css';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import OverlayForm from '../UI/form/OverlayForm';
import TransactionNav from './TransactionNav';
import Transaction from '../../models/Transaction';
import Category from '../../models/Category';
import { budgetActions } from '../../store/budget';

function TransactionForm(props: {
    isCurrent: boolean;
    onClickScheduled: () => void;
    onClickCurrent: () => void;
}) {
    const dispatch = useDispatch();
    const [isExpand, setIsExpand] = useState(false);
    const [amount, setAmount] = useState('');
    const titleRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const memoRef = useRef<HTMLTextAreaElement>(null);

    const expandHandler = () => {
        setIsExpand(true);
    };

    const cancelHandler = () => {
        setAmount('');
        setIsExpand(false);
    };

    const changeAmountHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setAmount(event.target.value);
    };

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        setAmount('');
        setIsExpand(false);
        const transaction = new Transaction({
            id: new Date().toString(),
            isCurrent: props.isCurrent,
            isExpense,
            title: [titleRef.current!.value],
            date: new Date(dateRef.current!.value),
            amount: +amount,
            category: new Category({
                id: 'new',
                title: 'new',
                budget: 6000,
            }),
            memo: memoRef.current!.value,
        });
        dispatch(budgetActions.addTransaction(transaction));
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
                value={amount}
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
                        value={amount}
                    />
                </div>
                <div className="input-field">
                    <label>제목</label>
                    <input type="text" ref={titleRef} />
                </div>
                <div className="input-field">
                    <label>날짜</label>
                    <input type="date" ref={dateRef} />
                </div>
                <div className={classes.selects}>
                    <div className="input-field">
                        <label>분류</label>
                        <input type="text" />
                    </div>
                    <div className="input-field">
                        <label>태그</label>
                        <input type="text" />
                    </div>
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
        <OverlayForm onSubmit={submitHandler} isShowBackdrop={isExpand}>
            {isExpand ? expandInput : shortInput}
        </OverlayForm>
    );
}

export default TransactionForm;
