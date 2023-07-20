import React, { useEffect, useImperativeHandle, useState } from 'react';
import { useDispatch } from 'react-redux';
import { uiActions } from '../../../store/ui';
import classes from './EditInput.module.css';

interface EditInputProps {
  id: string;
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
    const dispatch = useDispatch();

    useImperativeHandle(ref, () => {
      return {
        focus: editHandler,
      };
    });

    const getDefaultValue = () => {
      return (convertDefaultValue ? convertDefaultValue(value) : value) || '';
    };

    const [amount, setAmount] = useState(getDefaultValue());

    useEffect(() => {
      setAmount(getDefaultValue());
    }, [value]);

    const editHandler = async () => {
      dispatch(
        uiActions.setAmountOverlay({
          value: amount,
          onConfirm: confirmHandler,
        })
      );
    };

    const confirmHandler = (valueStr: string) => {
      let value = +valueStr;

      if (min !== undefined && value < min) {
        value = min;
        dispatch(
          uiActions.showModal({
            title: '전체 목표 초과',
            description: '전체 목표가 예정보다 작을 수 없습니다',
          })
        );
      }

      onConfirm && onConfirm(value.toString());
    };

    const amountSpan = <span onClick={editHandler}>{value}</span>;

    return (
      <div className={className}>
        <label htmlFor={id}>{label}</label>
        <button
          type="button"
          className={`${classes.edit} ${classes.pencil} ${editClass}`}
          onClick={editHandler}
        ></button>
        {amountSpan}
      </div>
    );
  }
);

export default EditInput;
