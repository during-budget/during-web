import React, { useImperativeHandle, useRef, useState } from 'react';
import classes from './TagInput.module.css';
import Tag from '../../UI/Tag';

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

                    // check empty input
                    if (!value || value === ' ') {
                        return prevState;
                    }

                    // check same item
                    const sameItem = prevState.find(
                        (item: string) => item === value
                    );

                    // set state
                    if (sameItem) {
                        return prevState;
                    } else {
                        return [...prevState, value];
                    }
                });
            } else if (removeKey) {
                setTagState((prevState) => {
                    // remove last item
                    return prevState.slice(0, -1) || [];
                });
            }
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
                        placeholder="태그를 입력하세요"
                    />
                </li>
            </ul>
        );
    }
);

export default TagInput;
