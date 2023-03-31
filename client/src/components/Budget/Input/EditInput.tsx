import { useRef, useState } from 'react';
import classes from './EditInput.module.css';

const EditInput = (props: {
    className?: string;
    value: string;
    confirmHandler?: (value: string) => void;
    convertDefaultValue?: (value: string) => void;
}) => {
    const [isEdit, setIsEdit] = useState(false);
    const editRef = useRef<HTMLInputElement>(null);

    const defaultValue = props.convertDefaultValue
        ? props.convertDefaultValue(props.value)
        : props.value;

    const editHandler = () => {
        if (isEdit) {
            const value = editRef.current!.value;
            props.confirmHandler && props.confirmHandler(value);
        }

        setIsEdit((prev) => !prev);
    };

    const amountInput = (
        <input
            ref={editRef}
            className={classes.edit}
            type="number"
            defaultValue={defaultValue || ''}
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
                onClick={editHandler}
            ></button>
        </div>
    );
};

export default EditInput;
