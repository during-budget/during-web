import React from 'react';
import Category from '../../../models/Category';
import classes from './CategoryInput.module.css';

const CategoryInput = React.forwardRef(
    (
        props: {
            categories: Category[];
            budgetId: string;
        },
        ref: any
    ) => {
        return (
            <div className="input-field">
                <label>분류</label>
                <select ref={ref}>
                    {props.categories.map((item: any) => {
                        return (
                            <option key={item.id} value={item.id}>
                                {item.icon} {item.title}
                            </option>
                        );
                    })}
                </select>
            </div>
        );
    }
);

export default CategoryInput;
