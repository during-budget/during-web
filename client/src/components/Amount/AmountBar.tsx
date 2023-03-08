import Amount from '../../models/Amount';
import classes from './AmountBar.module.css';

function AmountBar(props: { amount: Amount }) {
    const amount = props.amount;
    const currentHeight = `${(amount.current / amount.planned) * 100}%`;
    const scheduledHeight = `${(amount.scheduled / amount.planned) * 100}%`;

    return (
        <ul className={classes.container}>
            <li className={classes.planned}></li>
            <li
                className={classes.scheduled}
                style={{ height: scheduledHeight }}
            ></li>
            <li
                className={classes.current}
                style={{ height: currentHeight }}
            ></li>
        </ul>
    );
}

export default AmountBar;
