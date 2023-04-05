import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { useSelector } from 'react-redux';
import Category from '../../../models/Category';
import Select from '../../UI/Select';
import Budget from '../../../models/Budget';

const CategoryInput = React.forwardRef(
    (
        props: {
            budgetId: string;
            isExpense: boolean;
            defaultValue: string;
            className?: string;
            onChange?: (event?: React.ChangeEvent) => void;
            showEdit?: () => void;
            disabled?: boolean;
        },
        ref
    ) => {
        useImperativeHandle(ref, () => {
            return {
                value: () => categoryRef.current!.value(),
                icon: () => {
                    const currentId = categoryRef.current!.value();
                    const currentCategory = filteredCategories.find(
                        (item: Category) => item.id === currentId
                    );
                    return currentCategory.icon || '';
                },
            };
        });

        useEffect(() => {
            // NOTE: 초기값 기반 onChange 함수 실행
            props.onChange && props.onChange();
        }, [props, props.onChange]);

        const budgets = useSelector((state: any) => state.budget);
        const budget = budgets.find((item: Budget) => item.id === props.budgetId);
        const categories = budget?.categories || [];
        const categoryRef = useRef<any>(null);

        const filteredCategories = categories.filter(
            (item: Category) => item.isExpense === props.isExpense
        );

        const data = filteredCategories.map((item: Category) => {
            return {
                value: item.id,
                label: `${item.icon} ${item.title}`,
            };
        });

        const defaultValue =
            props.defaultValue ||
            filteredCategories[filteredCategories.length - 1].id;

        return (
            <>
                <Select
                    ref={categoryRef}
                    className={props.className}
                    data={data}
                    defaultValue={props.defaultValue || defaultValue}
                    onChange={props.onChange}
                    showEdit={props.showEdit}
                    disabled={props.disabled}
                />
            </>
        );
    }
);

export default CategoryInput;
