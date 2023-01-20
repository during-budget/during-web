import React, { useState } from 'react';
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
        const [isExpand, setIsExpand] = useState(false);

        const clickSelectHandler = () => {
            setIsExpand((prev) => !prev);
        };

        const clickOptionHandler = (
            event: React.MouseEvent<HTMLUListElement>
        ) => {
            const target = event.target as HTMLElement;
            if (target.nodeName === 'LI') {
                const id = target.getAttribute('data-id');
                ref.current.value = id;
            }
        };

        return (
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
                                        {item.icon} {item.title}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
);

export default CategoryInput;
