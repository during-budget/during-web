import React, { useImperativeHandle, useRef } from 'react';
import classes from './Select.module.css';

const Select = React.forwardRef(
    (
        props: {
            className?: string;
            data: { value: string; label: string }[];
            defaultValue?: string;
            onChange?: (event?: React.ChangeEvent) => void;
        },
        ref
    ) => {
        useImperativeHandle(ref, () => {
            return {
                value: () => {
                    return selectRef.current!.value;
                },
            };
        });

        const selectRef = useRef<HTMLSelectElement>(null);

        return (
            <div className={`${classes.container} ${props.className}`}>
                <select
                    ref={selectRef}
                    defaultValue={props.defaultValue}
                    onChange={props.onChange}
                    disabled
                >
                    {props.data.map((item, i) => (
                        <option key={i} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
                <ul>
                    <div className={classes.list}>
                        {props.data.map((item, i) => {
                            return <li key={i}>{item.label}</li>;
                        })}
                    </div>
                </ul>
            </div>
        );
    }
);

export default Select;
