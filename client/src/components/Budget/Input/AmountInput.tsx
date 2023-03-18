import React, { useImperativeHandle, useRef } from 'react';

const AmountInput = React.forwardRef(
    (
        props: {
            className?: string;
            onFocus?: (event: React.FocusEvent) => void;
            onClick?: (event: React.MouseEvent) => void;
            defaultValue?: string;
            value?: string;
            required?: boolean;
            readOnly?: boolean;
        },
        ref
    ) => {
        useImperativeHandle(ref, () => {
            return {
                value: () => amountRef.current!.value,
                clear: () => {
                    amountRef.current!.value = '';
                },
            };
        });

        const amountRef = useRef<HTMLInputElement>(null);

        return (
            <input
                ref={amountRef}
                className={props.className}
                type="number"
                placeholder="금액을 입력하세요"
                onFocus={props.onFocus}
                onClick={props.onClick}
                value={props.value}
                defaultValue={props.defaultValue}
                required={props.required}
                readOnly={props.readOnly}
            />
        );
    }
);

export default AmountInput;
