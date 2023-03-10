import { useEffect, useState } from 'react';
import Button from '../UI/Button';
import InputField from '../UI/InputField';
import OverlayForm from '../UI/OverlayForm';
import classes from './TransactionForm.module.css';

function TransactionForm() {
    const [isExpand, setIsExpand] = useState(false);

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
        <OverlayForm
            className={`${classes.container} ${isExpand && classes.expand}`}
            isShowBackdrop={isExpand}
            onClose={closeHandler}
        >
            {/* TODO: 각 인풋 모두 컴포넌트로 만들기 */}
            <div className={classes.amount}>
                <InputField
                    id="transaction-form-amount-field"
                    className={classes.field}
                >
                    <input
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
            <div className={classes.type}>
                <InputField
                    id="transaction-form-amount-field"
                    className={classes.field}
                >
                    <input placeholder="카테고리를 입력하세요" />
                </InputField>
                <InputField
                    id="transaction-form-amount-field"
                    className={classes.field}
                >
                    <input placeholder="결제수단을 입력하세요" />
                </InputField>
            </div>
            <div className={classes.note}>
                <InputField
                    id="transaction-form-amount-field"
                    className={classes.emoji}
                >
                    <input placeholder="이모지" />
                </InputField>
                <InputField
                    id="transaction-form-amount-field"
                    className={classes.field}
                >
                    <input placeholder="내용을 입력하세요" />
                </InputField>
            </div>
            <InputField
                id="transaction-form-amount-field"
                className={classes.field}
            >
                <input placeholder="태그를 입력하세요" />
            </InputField>
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
        </OverlayForm>
    );
}

export default TransactionForm;
