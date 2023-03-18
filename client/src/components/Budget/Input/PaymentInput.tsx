import React, { useImperativeHandle, useRef } from 'react';

const PaymentInput = React.forwardRef((props: { className: string }, ref) => {
    useImperativeHandle(ref, () => {
        return {
            value: () => paymentRef.current!.value,
        };
    });

    const paymentRef = useRef<HTMLSelectElement>(null);

    return (
        <select ref={paymentRef} className={props.className}>
            <option value="">결제수단 없음</option>
        </select>
    );
});

export default PaymentInput;
