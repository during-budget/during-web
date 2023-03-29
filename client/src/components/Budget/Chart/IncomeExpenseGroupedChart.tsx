import classes from './IncomeExpenseGroupedChart.module.css';
import IncomeExpenseAmount from '../Amount/IncomeExpenseAmount';
import GroupedBar from './GroupedBar';

function IncomeExpenseGroupedChart(props: {
    amount: { income: number; expense: number }[];
    height: string;
    barHeight?: string;
    label?: string[];
    className?: string;
    showZero?: boolean;
    showEmpty?: boolean;
}) {
    let max = 0;

    for (const amount of props.amount) {
        const currentMax = Math.max(amount.income, amount.expense);
        if (max < currentMax) {
            max = currentMax;
        }
    }

    return (
        <ul
            className={`${classes.container} ${props.className}`}
            style={{ height: props.height }}
        >
            {props.amount.map((item, i) => {
                const expense = (item.expense / max) * 100 + '%';
                const income = (item.income / max) * 100 + '%';

                return (
                    <li key={i} className={classes.chart}>
                        <GroupedBar
                            color={['var(--primary)', 'var(--secondary)']}
                            data={[expense, income]}
                            height="100%"
                            className={classes.bars}
                        />
                        {props.label && (
                            <p className={classes.label}>{props.label[i]}</p>
                        )}
                        <IncomeExpenseAmount
                            expense={item.expense}
                            income={item.income}
                            showZero={props.showZero}
                            showEmpty={props.showEmpty}
                        />
                    </li>
                );
            })}
        </ul>
    );
}

export default IncomeExpenseGroupedChart;
