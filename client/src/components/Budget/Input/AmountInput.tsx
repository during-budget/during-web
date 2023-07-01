import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAppDispatch } from '../../../hooks/redux-hook';
import Amount from '../../../models/Amount';
import { uiActions } from '../../../store/ui';

interface AmountInputProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onConfirm: (value: string) => void;
  defaultValue?: string;
  required?: boolean;
  readOnly?: boolean;
  isOpen?: boolean;
}

const AmountInput = React.forwardRef(
  (
    {
      id,
      className,
      style,
      onFocus,
      onBlur,
      onClick,
      onConfirm,
      defaultValue,
      required,
      readOnly,
      isOpen,
    }: AmountInputProps,
    ref
  ) => {
    const dispatch = useAppDispatch();
    const [value, setValue] = useState(defaultValue || '');

    useImperativeHandle(ref, () => {
      return {
        value,
        clear: () => {
          setValue('');
        },
        focus: () => {
          amountRef.current?.focus();
        },
      };
    });

    useEffect(() => {
      setValue(() => {
        const value = defaultValue || '';
        if (isOpen) {
          dispatch(uiActions.setAmountInput({ value, onConfirm }));
        }
        return value;
      });
    }, [defaultValue]);

    const amountRef = useRef<HTMLInputElement>(null);

    return (
      <input
        ref={amountRef}
        id={id}
        className={className}
        style={style}
        placeholder="금액을 입력하세요"
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={(event) => {
          onClick && onClick(event);
          dispatch(uiActions.setAmountInput({ value, onConfirm }));
        }}
        value={value ? Amount.getAmountStr(+value) : value}
        required={required}
        readOnly
      />
    );
  }
);

export default AmountInput;
