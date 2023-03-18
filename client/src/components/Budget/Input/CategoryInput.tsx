import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { useSelector } from 'react-redux';
import Category from '../../../models/Category';

const CategoryInput = React.forwardRef(
    (
        props: {
            isExpense: boolean;
            className?: string;
            defaultValue?: string;
            onChange?: (event?: React.ChangeEvent) => void;
        },
        ref
    ) => {
        useImperativeHandle(ref, () => {
            return {
                value: () => categoryRef.current!.value,
                icon: () => {
                    const currentId = categoryRef.current!.value;
                    const currentCategory = filteredCategories.find(
                        (item: Category) => item.id === currentId
                    );
                    return currentCategory.icon;
                },
            };
        });

        useEffect(() => {
            // NOTE: 초기값 기반 onChange 함수 실행
            props.onChange && props.onChange();
        }, []);

        const categories = useSelector((state: any) => state.category);
        const filteredCategories = categories.filter(
            (item: Category) => item.isExpense === props.isExpense
        );

        const categoryRef = useRef<HTMLSelectElement>(null);

        return (
            <select
                ref={categoryRef}
                className={props.className}
                defaultValue={props.defaultValue}
                onChange={props.onChange}
            >
                {filteredCategories.map((item: Category, i: number) => (
                    <option key={item.id} value={item.id}>
                        {item.icon} {item.title}
                    </option>
                ))}
            </select>
        );
    }
);

export default CategoryInput;
