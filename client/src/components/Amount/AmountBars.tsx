import classes from './AmountBars.module.css';
import AmountBar from './AmountBar';
import Amount from '../../models/Amount';

function AmountBars(props: {
    amountData: { amount: Amount; label: string }[];
}) {
    const amountData = props.amountData;
    const plans = amountData.map((data) => {
        return data.amount.planned;
    });
    const totalPlanned = plans.reduce((curr, next) => curr + next, 0);
    const widths = plans.map((planned) => (planned / totalPlanned) * 90 + '%');

    return (
        <ul className={classes.container}>
            {amountData.map((data, i) => {
                return (
                    <li
                        key={i}
                        className={classes.category}
                        style={{ width: widths[i] }}
                    >
                        <AmountBar amount={data.amount} />
                        <span className={classes.label}>{data.label}</span>
                    </li>
                );
            })}
        </ul>
    );
}

export default AmountBars;
