import { useRef, useState } from 'react';
import classes from './EditInput.module.css';

const EditInput = (props: {
    className?: string;
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

    const amountInput = (
        <input
            ref={editRef}
            className={classes.edit}
            type="string"
            defaultValue={defaultValue || ''}
            onFocus={props.onFocus}
        />
    );

    const amountSpan = <span>{props.value}</span>;

    return (
        <div className={props.className}>
            {isEdit ? amountInput : amountSpan}
            <button
                type="button"
                className={`${classes.edit} ${
                    isEdit ? classes.check : classes.pencil
                }`}
                onClick={isEdit ? confirmHandler : editHandler}
            ></button>
        </div>
    );
};

export default EditInput;
