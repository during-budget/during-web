import React, { useEffect, useImperativeHandle, useRef } from 'react';

const AmountInput = React.forwardRef(
  (
    props: {
      id: string;
      className?: string;
      style?: React.CSSProperties;
      onFocus?: (event: React.FocusEvent) => void;
      onClick?: (event: React.MouseEvent) => void;
      defaultValue?: string;
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

    useEffect(() => {
      amountRef.current!.value = props.defaultValue || '';
    }, [props.defaultValue]);

    const amountRef = useRef<HTMLInputElement>(null);

    return (
      <input
        ref={amountRef}
        id={props.id}
        className={props.className}
        style={props.style}
        type="number"
        placeholder="금액을 입력하세요"
        onFocus={props.onFocus}
        onClick={props.onClick}
        required={props.required}
        readOnly={props.readOnly}
      />
    );
  }
);

export default AmountInput;
