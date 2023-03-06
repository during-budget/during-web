import classes from './AmountDetailItem.module.css';

function AmountDetailItem(props: {
    className?: string;
    label: string;
    amount: string;
    labelColor: string;
    fontColor: string;
    fontSize: string;
}) {
    const style = {
        '--label-color': props.labelColor,
        '--font-color': props.fontColor,
        '--font-size': props.fontSize,
    } as React.CSSProperties;

    return (
        <li className={`${classes.container} ${props.className}`} style={style}>
            <span className={classes.label}>{props.label}</span>
            <span className={classes.amount}>{props.amount}</span>
        </li>
    );
}

export default AmountDetailItem;
