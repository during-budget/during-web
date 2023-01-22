import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Category from '../../../models/Category';
import { categoryActions } from '../../../store/category';
import classes from './CategoryInput.module.css';

const CategoryInput = React.forwardRef(
    (
        props: {
            categories: Category[];
            budgetId: string;
        },
        ref: any
    ) => {
        const dispatch = useDispatch();

        const [isExpand, setIsExpand] = useState(false);
        const [isAdd, setIsAdd] = useState(false);

        const categoryIconRef = useRef<HTMLInputElement>(null);
        const categoryTitleRef = useRef<HTMLInputElement>(null);
        const categoryBudgetAmountRef = useRef<HTMLInputElement>(null);

        const clickSelectHandler = () => {
            setIsExpand((prev) => !prev);
        };

        const clickOptionHandler = (
            event: React.MouseEvent<HTMLUListElement>
        ) => {
            const target = event.target as HTMLElement;

            if (isAdd) {
                return;
            }

            let id;
            if (target.nodeName === 'LI') {
                id = target.getAttribute('data-id');
                ref.current.value = id;
            } else if (target.nodeName === 'SPAN') {
                id = target.parentElement?.getAttribute('data-id');
            }

            if (id) {
                ref.current.value = id;
            }
        };

        const categoryAddHandler = () => {
            const budgetId = props.budgetId;
            const icon = categoryIconRef.current!.value;
            const title = categoryTitleRef.current!.value;
            const budgetAmount = +categoryBudgetAmountRef.current!.value;
            dispatch(
                categoryActions.craeteCategory({
                    budgetId,
                    icon,
                    title,
                    budgetAmount,
                })
            );
        };

        return (
            <>
                <div className={`input-field ${classes.category}`}>
                    <label>분류</label>
                    <span
                        className={classes.selectWrapper}
                        onClick={clickSelectHandler}
                    >
                        <select ref={ref} disabled>
                            {props.categories.map((item: any) => {
                                return (
                                    <option key={item.id} value={item.id}>
                                        {item.icon} {item.title}
                                    </option>
                                );
                            })}
                        </select>
                    </span>
                    {isExpand && (
                        <div className={classes.listWrapper}>
                            <ul
                                className={classes.list}
                                onClick={clickOptionHandler}
                            >
                                {props.categories.map((item: any) => {
                                    return (
                                        <li key={item.id} data-id={item.id}>
                                            <span>
                                                {item.icon} {item.title}
                                            </span>
                                        </li>
                                    );
                                })}

                                {!isAdd && (
                                    <li className={classes.button}>
                                        <button
                                            type="button"
                                            className="button__primary"
                                            onClick={() => {
                                                setIsAdd(true);
                                            }}
                                        >
                                            추가하기
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {isExpand && isAdd && (
                    <div className={classes.overlay}>
                        <div className="input-field">
                            <div className={classes.text}>
                                <input
                                    ref={categoryIconRef}
                                    className={classes.icon}
                                    type="text"
                                    maxLength={1}
                                    defaultValue="💰"
                                />
                                <input
                                    ref={categoryTitleRef}
                                    className={classes.title}
                                    type="text"
                                    placeholder="카테고리명"
                                />
                            </div>
                            <input
                                ref={categoryBudgetAmountRef}
                                type="number"
                                placeholder="예산액"
                            />
                        </div>
                        <div className={classes.buttons}>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdd(false);
                                }}
                            >
                                닫기
                            </button>
                            <button
                                type="button"
                                className="button__primary"
                                onClick={categoryAddHandler}
                            >
                                카테고리 추가
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    }
);

export default CategoryInput;
