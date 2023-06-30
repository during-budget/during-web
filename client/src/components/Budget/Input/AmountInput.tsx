import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAppDispatch } from '../../../hooks/redux-hook';
import Amount from '../../../models/Amount';
import { uiActions } from '../../../store/ui';

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
      isOpen?: boolean;
    },
    ref
  ) => {
    const dispatch = useAppDispatch();
    const [value, setValue] = useState(props.defaultValue || '');

    useImperativeHandle(ref, () => {
      return {
        value,
        clear: () => {
          setValue('');
        },
      };
    });

    useEffect(() => {
      setValue(() => {
        const value = props.defaultValue || '';
        if (props.isOpen) {
          dispatch(uiActions.setAmountInput({ value }));
        }
        return value;
      });
    }, [props.defaultValue]);

    const amountRef = useRef<HTMLInputElement>(null);

    return (
      <input
        ref={amountRef}
        id={props.id}
        className={props.className}
        style={props.style}
        placeholder="금액을 입력하세요"
        onFocus={props.onFocus}
        onClick={(event) => {
          props.onClick && props.onClick(event);
          dispatch(uiActions.setAmountInput({ value }));
        }}
        value={value ? Amount.getAmountStr(+value) : value}
        required={props.required}
        readOnly
      />
    );
  }
);

export default AmountInput;
