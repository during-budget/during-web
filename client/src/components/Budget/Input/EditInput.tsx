import { useRef, useState } from 'react';
import classes from './EditInput.module.css';

const EditInput = (props: {
  id?: string;
  className?: string;
  editClass?: string;
  cancelClass?: string;
  value: string;
  min?: number;
  confirmHandler?: (value: string) => void;
  convertDefaultValue?: (value: string) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  const defaultValue = props.convertDefaultValue
    ? props.convertDefaultValue(props.value)
    : props.value;

  const editHandler = async () => {
    await setIsEdit(true);
    editRef.current?.focus();
  };

  const confirmHandler = () => {
    let value = +editRef.current!.value;

    if (props.min !== undefined && value < props.min) {
      value = props.min;
      //TODO: 예정보다 작을 수 없습니다 표 띄우기.... onChange를 쓰도록 수정해야겠네.
    }

    props.confirmHandler && props.confirmHandler(value.toString());
    setIsEdit(false);
  };

  const cancelHandler = () => {
    setIsEdit(false);
  };

  const focusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === '0') {
      event.target.value = '';
    }
    props.onFocus && props.onFocus(event);
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
      id={props.id}
      className={classes.edit}
      type="number"
      defaultValue={defaultValue || ''}
      onFocus={focusHandler}
      onBlur={blurHandler}
    />
  );

  const amountSpan = <span onClick={editHandler}>{props.value}</span>;

  return (
    <div className={props.className}>
      {!isEdit && (
        <button
          type="button"
          className={`${classes.edit} ${classes.pencil} ${props.editClass}`}
          onClick={editHandler}
        ></button>
      )}
      {isEdit && (
        <button
          type="button"
          className={`${classes.edit} ${classes.cancel} ${props.cancelClass}`}
          onClick={cancelHandler}
        ></button>
      )}
      {isEdit ? amountInput : amountSpan}
      {isEdit && (
        <button
          type="button"
          className={`${classes.edit} ${classes.check} ${props.editClass}`}
          onClick={confirmHandler}
        ></button>
      )}
    </div>
  );
};

export default EditInput;
