import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import classes from './EditInput.module.css';

interface EditInputProps {
  id?: string;
  className?: string;
  editClass?: string;
  cancelClass?: string;
  label?: string;
  value: string;
  min?: number;
  onConfirm?: (value: string) => void;
  convertDefaultValue?: (value: string) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const EditInput = React.forwardRef(
  (
    {
      id,
      className,
      editClass,
      cancelClass,
      label,
      value,
      min,
      onConfirm,
      convertDefaultValue,
      onFocus,
    }: EditInputProps,
    ref
  ) => {
    useImperativeHandle(ref, () => {
      return {
        focus: () => {
          setIsEdit(true);
        },
      };
    });

    const [isEdit, setIsEdit] = useState(false);
    const editRef = useRef<HTMLInputElement>(null);

    const defaultValue = convertDefaultValue ? convertDefaultValue(value) : value;

    useEffect(() => {
      if (isEdit) {
        editRef.current?.focus();
      }
    }, [isEdit]);

    const editHandler = async () => {
      setIsEdit(true);
    };

    const confirmHandler = () => {
      let value = +editRef.current!.value;

      if (min !== undefined && value < min) {
        value = min;
        //TODO: 예정보다 작을 수 없습니다 표 띄우기.... onChange를 쓰도록 수정해야겠네.
      }

      onConfirm && onConfirm(value.toString());
      setIsEdit(false);
    };

    const cancelHandler = () => {
      setIsEdit(false);
    };

    const focusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
      if (event.target.value === '0') {
        event.target.value = '';
      }
      onFocus && onFocus(event);
    };

    const blurHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.value) {
        event.target.value = '0';
      }
      confirmHandler();
    };

    const amountInput = (
      <input
        ref={editRef}
        id={id}
        className={classes.edit}
        type="number"
        defaultValue={defaultValue || ''}
        onFocus={focusHandler}
        onBlur={blurHandler}
      />
    );

    const amountSpan = <span onClick={editHandler}>{value}</span>;

    return (
      <div className={className}>
        <label htmlFor={`${id}`}>{label}</label>
        {!isEdit && (
          <button
            type="button"
            className={`${classes.edit} ${classes.pencil} ${editClass}`}
            onClick={editHandler}
          ></button>
        )}
        {isEdit && (
          <button
            type="button"
            className={`${classes.edit} ${classes.cancel} ${cancelClass}`}
            onClick={cancelHandler}
          ></button>
        )}
        {isEdit ? amountInput : amountSpan}
        {isEdit && (
          <button
            type="button"
            className={`${classes.edit} ${classes.check} ${editClass}`}
            onClick={confirmHandler}
          ></button>
        )}
      </div>
    );
  }
);

export default EditInput;
