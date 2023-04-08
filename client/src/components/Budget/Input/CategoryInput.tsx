import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classes from './CategoryInput.module.css';
import Category from '../../../models/Category';
import Select from '../../UI/Select';
import Budget from '../../../models/Budget';
import { useDispatch } from 'react-redux';
import { uiActions } from '../../../store/ui';
import ExpenseTab from '../UI/ExpenseTab';

const CategoryInput = React.forwardRef(
    (
        props: {
            budgetId: string;
            isExpense: boolean;
            setIsExpense: React.Dispatch<boolean>;
            defaultValue: string;
            className?: string;
            onChange?: (event?: React.ChangeEvent) => void;
            disabled?: boolean;
            setIsEditSetting: (isEdit: boolean) => void;
        },
        ref
    ) => {
        const dispatch = useDispatch();
        const categoryRef = useRef<any>(null);

        const [isExpense, setIsExpense] = useState(props.isExpense);

        // Set category data
        const budgets = useSelector((state: any) => state.budget.data);

        const budget = budgets.find(
            (item: Budget) => item.id === props.budgetId
        );
        const budgetCategories = budget?.categories || [];

        const filteredCategories = budgetCategories.filter(
            (item: Category) => item.isExpense === isExpense
        );

        // Set state
        const [categories, setCategories] =
            useState<Category[]>(filteredCategories);
        const [defaultValue, setDefaultValue] = useState(
            props.defaultValue || categories[categories.length - 1]?.id
        );

        useImperativeHandle(ref, () => {
            return {
                value: () => categoryRef.current!.value(),
                icon: () => {
                    const currentId = categoryRef.current!.value();
                    const currentCategory = categories.find(
                        (item: Category) => item.id === currentId
                    );
                    return currentCategory?.icon || '';
                },
            };
        });

        // NOTE: 수입/지출 변경 시 카테고리 업데이트
        useEffect(() => {
            const filteredCategories = budgetCategories.filter(
                (item: Category) => item.isExpense === isExpense
            );
            const defaultValue =
                filteredCategories[filteredCategories.length - 1]?.id;

            setDefaultValue(defaultValue);
            setCategories(filteredCategories);
            setCategoryList(getCategoryList(filteredCategories));
        }, [isExpense, budgetCategories]);

        // NOTE: TransactionForm의 수입/지출 변경 반영
        useEffect(() => {
            setIsExpense(props.isExpense);
        }, [props.isExpense]);

        // NOTE: TransactionForm의 defaultValue 반영
        useEffect(() => {
            setDefaultValue(
                props.defaultValue || categories[categories.length - 1]?.id
            );
        }, [props.defaultValue]);

        const typeChangeHandler = (isExpense: boolean) => {
            props.setIsExpense(isExpense);
            setIsExpense(isExpense);
        };

        const getCategoryList = (categories: Category[]) => {
            // Data for select list
            const categoryList: any = categories.map((item: Category) => {
                return {
                    value: item.id,
                    label: `${item.icon} ${item.title}`,
                };
            });

            return [
                {
                    element: (
                        <ExpenseTab
                            className={classes.tab}
                            key="category-input-expense-tab"
                            id="category-input-expense-tab"
                            isExpense={isExpense}
                            setIsExpense={typeChangeHandler}
                        />
                    ),
                },
                ...categoryList,
            ];
        };

        const [categoryList, setCategoryList] = useState(
            getCategoryList(categories)
        );

        // NOTE: 카테고리 목록 변경 이후 change(아이콘 placeholder 세팅) 실행 - select 목록에서 찾을 수 있도록
        useEffect(() => {
            props.onChange && props.onChange();
        }, [categoryList]);

        return (
            <>
                <Select
                    ref={categoryRef}
                    className={props.className}
                    data={categoryList}
                    defaultValue={defaultValue}
                    onChange={props.onChange}
                    showEdit={() => {
                        dispatch(uiActions.setIsExpense(isExpense));
                        props.setIsEditSetting(true);
                    }}
                    disabled={props.disabled}
                />
            </>
        );
    }
);

export default CategoryInput;
