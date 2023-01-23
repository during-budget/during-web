import React, { useImperativeHandle, useRef, useState } from 'react';
import Tag from '../Tag';
import classes from './TagInput.module.css';

const TagInput = React.forwardRef(
    (props: { defaultValue: string[] }, ref: any) => {
        const [tagState, setTagState] = useState<String[]>(
            props.defaultValue || []
        );
        const inputRef = useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => {
            return {
                value: tagState,
            };
        });

        const resizeHandler = (event: React.KeyboardEvent) => {
            const input = event.target as HTMLInputElement;
            if (event.key === ' ') {
                setTagState((prevState) => {
                    const value = input.value;
                    const sameItem = prevState.find((item) => item === value);

                    input.value = '';

                    if (sameItem) {
                        return prevState;
                    } else {
                        return [...prevState, value];
                    }
                });
            } else if (event.key === 'Backspace' && input.value === '')
                setTagState((prevState) => {
                    const lastIdx = prevState.length - 1;
                    return prevState.filter((_, idx) => idx !== lastIdx);
                });
        };

        const removeHandler = (event: React.MouseEvent) => {
            const target = event.target as HTMLSpanElement;
            setTagState((prevState) => {
                return prevState.filter((item) => {
                    return item.trim() !== target.innerText.trim();
                });
            });
        };

        return (
            <div className={classes.field}>
                <label>태그</label>
                <ul className={classes.tags}>
                    {tagState.map((item) => {
                        return (
                            <li
                                key={item.toString()}
                                className={classes.tag}
                                onClick={removeHandler}
                            >
                                <Tag>{item}</Tag>
                            </li>
                        );
                    })}
                    <li className={classes.input}>
                        <input
                            ref={inputRef}
                            type="text"
                            onKeyUp={resizeHandler}
                        />
                    </li>
                </ul>
            </div>
        );
    }
);

export default TagInput;
