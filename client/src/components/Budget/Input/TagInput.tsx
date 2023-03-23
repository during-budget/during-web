import React, { useImperativeHandle, useRef, useState } from 'react';
import classes from './TagInput.module.css';
import Tag from '../../UI/Tag';

const addTag = (prevState: any, value: string) => {
    // check empty input
    if (!value || value === ' ') {
        return prevState;
    }

    // check same item
    const sameItem = prevState.find((item: string) => item === value);

    // set state
    if (sameItem) {
        return prevState;
    } else {
        return [...prevState, value];
    }
};

const TagInput = React.forwardRef(
    (
        props: {
            className?: string;
            defaultValue?: string[];
        },
        ref
    ) => {
        useImperativeHandle(ref, () => {
            return {
                value: () => tagState,
            };
        });

        const [tagState, setTagState] = useState<String[]>(
            props.defaultValue || []
        );

        const keyUpHandler = (event: React.KeyboardEvent) => {
            const input = event.target as HTMLInputElement;

            const addKey = event.key === ' ' || event.key === 'Enter';
            const removeKey = event.key === 'Backspace' && input.value === '';

            if (addKey) {
                setTagState((prevState: any) => {
                    const value = input.value;
                    input.value = '';

                    return addTag(prevState, value);
                });
            } else if (removeKey) {
                setTagState((prevState) => {
                    return prevState.slice(0, -1) || []; // remove last item
                });
            }
        };

        const blurHandler = (event: React.FocusEvent) => {
            const input = event.target as HTMLInputElement;

            const value = input.value;
            input.value = '';

            setTagState((prevState: any) => {
                return addTag(prevState, value);
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

        const preventSubmit = (event: React.KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        };

        const emptyClass = tagState.length === 0 ? classes.empty : '';
        const containerClass = [classes.container, emptyClass].join(' ');

        return (
            <ul className={containerClass}>
                {tagState.map((item, i) => (
                    <li key={i} onClick={removeHandler}>
                        <Tag isDark={true}>{item}</Tag>
                    </li>
                ))}
                <li>
                    <input
                        className={props.className}
                        type="text"
                        onKeyUp={keyUpHandler}
                        onKeyDown={preventSubmit}
                        onBlur={blurHandler}
                        placeholder="태그를 입력하세요"
                    />
                </li>
            </ul>
        );
    }
);

export default TagInput;
