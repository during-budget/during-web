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
import Inform from '../UI/Inform';

function BudgetForm() {
    const dispatch = useDispatch();
    const navigation = useNavigate();

    const formState = useSelector((state: any) => state.ui.budgetForm);
    const categories = useSelector((state: any) => state.categories);

    const [isExpense, setIsExpense] = useState(true);
    const titleRef = useRef<HTMLInputElement>(null);
    const [expensePlannedState, setExpensePlannedState] = useState(
        formState.expensePlanned
    );
    const [incomePlannedState, setIncomePlannedState] = useState(
        formState.incomePlanned
    );
    const [categoryState, setCategoryState] = useState(
        {} as Record<string, any>
    );
    const [overAmount, setOverAmount] = useState(0);

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

    useEffect(() => {
        let totalCategory = 0;
        for (const key in categoryState) {
            totalCategory += categoryState[key];
        }

        if (isExpense) {
            setOverAmount(expensePlannedState - totalCategory);
        } else {
            setOverAmount(incomePlannedState - totalCategory);
        }
    }, [isExpense, categoryState, expensePlannedState, incomePlannedState]);

    const expensePlanHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExpensePlannedState(event.target.value);
    };

    const incomePlanHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIncomePlannedState(event.target.value);
    };

    const cancelHandler = () => {
        dispatch(uiActions.resetBudgetForm());
    };

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        const title = titleRef.current?.value;
        const expensePlanned = expensePlannedState;
        const incomePlanned = incomePlannedState;
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
                        type="number"
                        onChange={expensePlanHandler}
                        value={expensePlannedState}
                    />
                </div>
                <div className="input-field">
                    <label>목표 수입</label>
                    <input
                        type="number"
                        onChange={incomePlanHandler}
                        value={incomePlannedState}
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
                {overAmount !== 0 && (
                    <Inform isError={overAmount < 0}>
                        <span>카테고리별 목표의 합이 전체 목표보다</span>
                        <p>
                            <strong>{overAmount}원</strong>
                            {overAmount < 0 ? ' 더 큽니다' : ' 모자랍니다'}
                        </p>
                    </Inform>
                )}
                <ul className={classes.categories}>
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
                                <li
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
                                        type="number"
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
                                </li>
                            );
                        })}
                </ul>
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
