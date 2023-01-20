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
        const clickSelectHandler = (
            event: React.MouseEvent<HTMLDivElement>
        ) => {
            ref.current.value = 'c3';
        };

        return (
            <div className="input-field">
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
            </div>
        );
    }
);

export default CategoryInput;
