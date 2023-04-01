import classes from './IncomeExpenseAmount.module.css';

function IncomeExpenseAmount(props: {
    expense: number;
    income: number;
    showZero?: boolean;
    showEmpty?: boolean;
}) {
    const { expense, income } = props;

    const show = props.showEmpty || expense || income || null;

    return (
        <div
            className={classes.container}
            style={{ visibility: show ? 'visible' : 'hidden' }}
        >
            {expense || props.showZero ? (
                <p className={classes.expense}>
                    {'-' + expense.toLocaleString()}
                </p>
            ) : (
                ''
            )}
            {income || props.showZero ? (
                <p className={classes.income}>
                    {'+' + income.toLocaleString()}
                </p>
            ) : (
                ''
            )}
        </div>
    );
}

export default IncomeExpenseAmount;
