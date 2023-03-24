import { useRef, useState } from 'react';
import InputField from '../../UI/InputField';
import classes from './AmountDetailItem.module.css';

function AmountDetailItem(props: {
    className?: string;
    label: string;
    amountStr: string;
    labelColor: string;
    fontColor: string;
    fontSize: string;
    editHandler?: (amount: number) => void;
    editDefaultValue?: number;
}) {
    const [isEdit, setIsEdit] = useState(false);
    const editRef = useRef<HTMLInputElement>(null);

    const style = {
        '--label-color': props.labelColor,
        '--font-color': props.fontColor,
        '--font-size': props.fontSize,
    } as React.CSSProperties;

    const editHandler = () => {
        if (isEdit) {
            const amount = editRef.current?.value || 0;
            props.editHandler && props.editHandler(+amount);
        }

        setIsEdit((prev) => !prev);
    };

    const defaultAmount = +props.amountStr.replace(/[^0-9]/g, '');

    const editInput = (
        <input
            className={classes.edit}
            ref={editRef}
            type="number"
            defaultValue={defaultAmount}
        ></input>
    );

    const amountSpan = (
        <span className={classes.amount}>{props.amountStr}</span>
    );

    return (
        <li className={`${classes.container} ${props.className}`} style={style}>
            <span className={classes.label}>{props.label}</span>
            {isEdit ? editInput : amountSpan}
            {props.editHandler && (
                <button
                    type="button"
                    className={`${classes.edit} ${
                        isEdit ? classes.check : classes.pencil
                    }`}
                    onClick={editHandler}
                ></button>
            )}
        </li>
    );
}

export default AmountDetailItem;
