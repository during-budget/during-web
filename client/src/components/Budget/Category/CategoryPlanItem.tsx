import classes from './CategoryPlanItem.module.css';
import Icon from '../../UI/Icon';
import { useEffect, useState } from 'react';
import Amount from '../../../models/Amount';

function CategoryPlanItem(props: {
    idx: number;
    icon: string;
    title: string;
    plan: string;
    onChange?: (i: number, value: number) => void;
}) {
    const [plan, setPlan] = useState(props.plan);

    // Change - Set number
    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/[^0-9]+/g, '');

        setPlan(value);

        props.onChange && props.onChange(props.idx, +value);
    };

    // Focus - Conver to number
    const focusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/[^0-9]+/g, '');

        if (value === '0') {
            setPlan('');
        } else {
            setPlan(value);
        }

        event.target.scrollIntoView({
            block: 'start',
            behavior: 'smooth',
        });
    };

    // Blur - Set AmountStr
    const blurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (value === '' || +value <= 0) {
            setPlan('0원');
        } else {
            setPlan(Amount.getAmountStr(+value));
        }
    };

    return (
        <li className={classes.container}>
            <div className={classes.info}>
                <Icon>{props.icon}</Icon>
                <p>{props.title}</p>
            </div>
            {/* TODO: number input으로 대체 */}
            <input
                type="text"
                value={plan}
                onChange={changeHandler}
                onFocus={focusHandler}
                onBlur={blurHandler}
            ></input>
        </li>
    );
}

export default CategoryPlanItem;
