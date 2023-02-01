import { useDispatch, useSelector } from 'react-redux';
import classes from './BudgetForm.module.css';
import OverlayForm from '../UI/form/OverlayForm';
import { uiActions } from '../../store/ui';
import RadioTab from '../UI/RadioTab';
import { useEffect, useRef, useState } from 'react';

function BudgetForm() {
    const dispatch = useDispatch();

    const formState = useSelector((state: any) => state.ui.budgetForm);

    const [isExpense, setIsExpense] = useState(true);
    const titleRef = useRef<HTMLInputElement>(null);

    const cancelHandler = () => {
        dispatch(uiActions.resetBudgetForm());
    };

    useEffect(() => {
        titleRef.current?.focus();
    }, [formState.isShow]);

    const inputs = (
        <div className={classes.inputs}>
            <h5>
                {formState.startDate &&
                    formState.startDate.toLocaleDateString('ko-KR')}
                ~
                {formState.endDate &&
                    formState.endDate.toLocaleDateString('ko-KR')}
            </h5>
            <div className="input-field">
                <label>제목</label>
                <input ref={titleRef} defaultValue={formState.title} />
            </div>
            <div className={classes.total}>
                <div className="input-field">
                    <label>목표 지출</label>
                    <input defaultValue={formState.expansePlanned} />
                </div>
                <div className="input-field">
                    <label>목표 수입</label>
                    <input defaultValue={formState.incomePlanned} />
                </div>
            </div>

            <div className="input-field">
                <div className={classes.categorylabel}>
                    <label>카테고리별 목표</label>
                    <RadioTab
                        name="budget-form-category"
                        values={[
                            {
                                label: '지출',
                                value: 'expense',
                                checked: isExpense,
                                onChange: () => {
                                    setIsExpense(true);
                                },
                            },
                            {
                                label: '수입',
                                value: 'income',
                                checked: !isExpense,
                                onChange: () => {
                                    setIsExpense(false);
                                },
                            },
                        ]}
                    />
                </div>
                <div className={classes.categories}>
                    {formState.categories
                        .filter((category: any) => {
                            if (isExpense) {
                                return category.isExpense;
                            } else {
                                return category.isIncome;
                            }
                        })
                        .map((category: any) => {
                            return (
                                <div
                                    key={category.id}
                                    className={classes.category}
                                >
                                    <div className={classes.info}>
                                        <p className={classes.icon}>
                                            {category.icon}
                                        </p>
                                        <p>{category.title}</p>
                                    </div>
                                    <input
                                        defaultValue={
                                            category.amount
                                                ? category.amount.planned
                                                : 0
                                        }
                                    />
                                </div>
                            );
                        })}
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
                    type="submit"
                    onClick={() => {}}
                >
                    완료
                </button>
            </div>
        </div>
    );

    return (
        <>
            {formState.isShow && (
                <div className={classes.outside} onClick={cancelHandler}></div>
            )}
            {formState.isShow && (
                <OverlayForm isShowBackdrop={formState.isExpand}>
                    {inputs}
                </OverlayForm>
            )}
        </>
    );
}

export default BudgetForm;
