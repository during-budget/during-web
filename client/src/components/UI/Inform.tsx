import { ReactNode } from 'react';
import classes from './Inform.module.css';

function Inform(props: {
    isError: boolean;
    children: ReactNode;
    hideIcon?: boolean;
}) {
    const msgClass = props.isError ? classes.error : classes.inform;
    return (
        <div className={`${classes.msg} ${msgClass}`}>
            {!props.hideIcon && (
                <i
                    className={`fa-solid fa-circle-exclamation ${classes.icon}`}
                />
            )}
            {props.children}
        </div>
    );
}

export default Inform;
