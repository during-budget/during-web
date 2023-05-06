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
      <option>연결계좌 없음</option>
    </select>
  );
});

export default PaymentInput;
