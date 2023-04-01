import Amount from '../../../models/Amount';
import classes from './AmountBar.module.css';

function AmountBar(props: { amount: Amount; borderRadius?: string }) {
    const amount = props.amount;
    const currentHeight = `${(amount.current / amount.planned) * 100}%`;
    const scheduledHeight = `${(amount.scheduled / amount.planned) * 100}%`;

    const borderRadius = props.borderRadius || '0.5rem';

    return (
        <ul className={classes.container} style={{ borderRadius }}>
            <li className={classes.planned} style={{ borderRadius }}></li>
            <li
                className={classes.scheduled}
                style={{ height: scheduledHeight, borderRadius }}
            ></li>
            <li
                className={classes.current}
                style={{ height: currentHeight, borderRadius }}
            ></li>
        </ul>
    );
}

export default AmountBar;
