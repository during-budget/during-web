import classes from './AmountBars.module.css';
import AmountBar from './AmountBar';
import Amount from '../../models/Amount';

function AmountBars(props: {
    amountData: {
        amount: Amount;
        label: string;
        isOver?: boolean;
        onClick?: (i: number) => void;
    }[];
    isTop?: boolean;
    isExpense?: boolean;
    className?: string;
}) {
    const amountData = props.amountData;
    const plans = amountData.map((data) => {
        return data.amount.planned;
    });
    const totalPlanned = plans.reduce((curr, next) => curr + next, 0);
    const widths = plans.map((planned) => (planned / totalPlanned) * 90 + '%');

    return (
        <ul className={`${classes.container} ${props.className}`}>
            {amountData.map((data, i) => {
                return (
                    <li
                        key={i}
                        className={classes.bar}
                        onClick={() => {
                            data.onClick && data.onClick(i);
                        }}
                        style={{ width: widths[i] }}
                    >
                        {data.isOver && (
                            <i className="fa-solid fa-circle-exclamation"></i>
                        )}
                        {props.isTop && (
                            <span className={classes.label}>{data.label}</span>
                        )}
                        <AmountBar amount={data.amount} />
                        {!props.isTop && (
                            <span className={classes.label}>{data.label}</span>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}

export default AmountBars;
