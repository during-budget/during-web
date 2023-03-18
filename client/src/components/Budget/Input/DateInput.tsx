import React, { useImperativeHandle, useRef } from 'react';

const DateInput = React.forwardRef(
    (
        props: { className: string; defaultValue?: string; required?: boolean },
        ref
    ) => {
        useImperativeHandle(ref, () => {
            return {
                value: () => dateRef.current!.value,
            };
        });

        const dateRef = useRef<HTMLInputElement>(null);

        return (
            <input
                className={props.className}
                ref={dateRef}
                type="date"
                placeholder="날짜를 입력하세요"
                defaultValue={props.defaultValue}
                required={props.required}
            />
        );
    }
);

export default DateInput;
