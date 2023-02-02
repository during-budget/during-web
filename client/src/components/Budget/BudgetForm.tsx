import { useDispatch, useSelector } from 'react-redux';
import classes from './BudgetForm.module.css';
import OverlayForm from '../UI/form/OverlayForm';
import { uiActions } from '../../store/ui';
import RadioTab from '../UI/RadioTab';
import React, { useEffect, useRef, useState } from 'react';
import Category from '../../models/Category';
import { budgetActions } from '../../store/budget';
import Amount from '../../models/Amount';
import { createBudget } from '../../util/api';
import { useNavigate } from 'react-router-dom';

function BudgetForm() {
    const dispatch = useDispatch();
    const navigation = useNavigate();

    const formState = useSelector((state: any) => state.ui.budgetForm);
    const categories = useSelector((state: any) => state.categories);

    const [isExpense, setIsExpense] = useState(true);
    const titleRef = useRef<HTMLInputElement>(null);
    const expensePlannedRef = useRef<HTMLInputElement>(null);
    const incomePlannedRef = useRef<HTMLInputElement>(null);
    const [categoryState, setCategoryState] = useState(
        {} as Record<string, any>
    );

    useEffect(() => {
        categories.forEach((category: any) => {
            setCategoryState((prevAmount) => {
                return { ...prevAmount, [category.id]: '0' };
            });
        });
    }, []);

    useEffect(() => {
        titleRef.current?.focus();
    }, [formState.isShow]);

    const cancelHandler = () => {
        dispatch(uiActions.resetBudgetForm());
    };

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        const title = titleRef.current?.value;
        const expensePlanned = +expensePlannedRef.current!.value;
        const incomePlanned = +incomePlannedRef.current!.value;
        const budgetCategories = categories.map((category: Category) => {
            const { id, title, icon, isExpense, isIncome } = category;
            const planned = categoryState[id] || '';
            return new Category({
                id,
                title,
                icon,
                isExpense,
                isIncome,
                amount: new Amount(0, 0, +planned),
            });
        });
        const newBudget = {
            title,
            startDate: formState.startDate,
            endDate: formState.endDate,
            expensePlanned,
            expenseCurrent: 0,
            expenseScheduled: 0,
            incomePlanned,
            incomeCurrent: 0,
            incomeScheduled: 0,
            categories: budgetCategories,
        };
        dispatch(budgetActions.addBudget(newBudget));
        dispatch(uiActions.resetBudgetForm());
        const budgetId = await createBudget(newBudget);
        navigation(`/budget/${budgetId}`);
    };
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
                    <input
                        ref={expensePlannedRef}
                        defaultValue={formState.expansePlanned}
                    />
                </div>
                <div className="input-field">
                    <label>목표 수입</label>
                    <input
                        ref={incomePlannedRef}
                        defaultValue={formState.incomePlanned}
                    />
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
                                        onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            setCategoryState((prevState) => {
                                                return {
                                                    ...prevState,
                                                    [category.id]:
                                                        event.target.value,
                                                };
                                            });
                                        }}
                                        value={categoryState[category.id]}
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
                <OverlayForm onSubmit={submitHandler}>{inputs}</OverlayForm>
            )}
        </>
    );
}

export default BudgetForm;
