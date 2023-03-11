import { useEffect, useState } from 'react';
import Button from '../UI/Button';
import ExpenseTab from '../UI/ExpenseTab';
import InputField from '../UI/InputField';
import Overlay from '../UI/Overlay';
import classes from './TransactionForm.module.css';
import TransactionNav from './TransactionNav';

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

    return (
        <Overlay
            className={`${classes.container} ${isExpand && classes.expand}`}
            isShowBackdrop={isExpand}
            onClose={closeHandler}
        >
            <form onSubmit={submitHandler}>
                {/* TODO: 각 인풋 모두 컴포넌트로 만들기 */}
                <div className={classes.amount}>
                    <InputField
                        id="transaction-form-amount-field"
                        className={classes.field}
                    >
                        <input
                            type="number"
                            placeholder="금액을 입력하세요"
                            onFocus={expandHandler}
                            onClick={expandHandler}
                        />
                    </InputField>
                    <Button onClick={expandHandler}>내역 추가</Button>
                </div>
                <InputField
                    id="transaction-form-amount-field"
                    className={classes.field}
                >
                    <input
                        type="date"
                        placeholder="날짜를 입력하세요"
                        lang="en-US"
                    />
                </InputField>
                <div className={classes.select}>
                    <InputField
                        id="transaction-form-amount-field"
                        className={classes.field}
                    >
                        <select>
                            <option>카테고리 없음</option>
                        </select>
                    </InputField>
                    <InputField
                        id="transaction-form-amount-field"
                        className={classes.field}
                    >
                        <select>
                            <option>결제수단 없음</option>
                        </select>
                    </InputField>
                </div>
                <div className={classes.note}>
                    <div className={classes.emoji}>
                        <input type="text" placeholder="😀"></input>
                    </div>
                    <InputField
                        id="transaction-form-amount-field"
                        className={classes.field}
                    >
                        <input type="text" placeholder="내용을 입력하세요" />
                    </InputField>
                </div>
                <InputField
                    id="transaction-form-amount-field"
                    className={classes.field}
                >
                    <input type="text" placeholder="태그를 입력하세요" />
                </InputField>
                <InputField
                    id="transaction-form-amount-field"
                    className={classes.field}
                >
                    <textarea placeholder="상세 내용을 입력하세요" rows={2} />
                </InputField>

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
            </form>
        </Overlay>
    );
}

export default TransactionForm;
