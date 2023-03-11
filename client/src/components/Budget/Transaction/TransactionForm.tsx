import { useEffect, useState } from 'react';
import AmountInput from '../Input/AmountInput';
import CategoryInput from '../Input/CategoryInput';
import DateInput from '../Input/DateInput';
import DetailInput from '../Input/DetailInput';
import EmojiInput from '../Input/EmojiInput';
import NoteInput from '../Input/NoteInput';
import PaymentInput from '../Input/PaymentInput';
import TagInput from '../Input/TagInput';
import Button from '../../UI/Button';
import ExpenseTab from '../UI/ExpenseTab';
import Overlay from '../../UI/Overlay';
import classes from './TransactionForm.module.css';
import TransactionNav from './TransactionNav';

const ID = 'transaction-form';

function TransactionForm() {
    const [isExpand, setIsExpand] = useState(false);

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
    };

    const expandHandler = () => {
        setIsExpand(true);
    };

    const closeHandler = () => {
        setIsExpand(false);
    };

    useEffect(() => {
        // NOTE: Disable body scroll
        const body = document.querySelector('body');
        if (isExpand) {
            body?.style.setProperty('overflow', 'hidden');
        } else {
            body?.style.setProperty('overflow', 'scroll');
        }
    }, [isExpand]);

    const amountField = (
        <div className={classes.amount}>
            <AmountInput
                id={ID}
                className={classes.field}
                onFocus={expandHandler}
                onClick={expandHandler}
            />
            <Button onClick={expandHandler}>내역 추가</Button>
        </div>
    );

    const selectField = (
        <div className={classes.select}>
            <CategoryInput id={ID} className={classes.field} />
            <PaymentInput id={ID} className={classes.field} />
        </div>
    );

    const noteField = (
        <div className={classes.note}>
            <EmojiInput
                id={ID}
                className={`${classes.field} ${classes.emoji}`}
            />
            <NoteInput id={ID} className={classes.field} />
        </div>
    );

    return (
        <Overlay
            className={`${classes.container} ${isExpand && classes.expand}`}
            isShowBackdrop={isExpand}
            onClose={closeHandler}
        >
            {/* form */}
            <form onSubmit={submitHandler}>
                {amountField}
                <DateInput id={ID} className={classes.field} />
                {selectField}
                {noteField}
                <TagInput id={ID} className={classes.field} />
                <DetailInput id={ID} className={classes.field} />
            </form>
            {/* types */}
            <div className={classes.types}>
                <ExpenseTab
                    id="transaction-form-expense"
                    isExpense={true}
                    setIsExpense={() => {}}
                />
                <span>|</span>
                <TransactionNav
                    id="transaction-form-current"
                    isCurrent={true}
                    setIsCurrent={() => {}}
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
                <Button styleClass="primary" onClick={closeHandler}>
                    완료
                </Button>
            </div>
        </Overlay>
    );
}

export default TransactionForm;
