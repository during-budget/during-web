import { useRef, useState } from 'react';
import classes from './EditInput.module.css';

const EditInput = (props: {
    className?: string;
    editClass?: string;
    cancelClass?: string;
    value: string;
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
        const value = editRef.current!.value;
        props.confirmHandler && props.confirmHandler(value);
        setIsEdit(false);
    };

    const cancelHandler = () => {
        setIsEdit(false);
    };

    const amountInput = (
        <input
            ref={editRef}
            className={classes.edit}
            type="number"
            defaultValue={defaultValue || ''}
            onFocus={props.onFocus}
            onBlur={confirmHandler}
        />
    );

    const amountSpan = <span>{props.value}</span>;

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
