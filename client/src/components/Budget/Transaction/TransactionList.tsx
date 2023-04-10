import Transaction from '../../../models/Transaction';
import classes from './TransactionList.module.css';
import { getNumericHypenDateString } from '../../../util/date';
import TransactionItem from './TransactionItem';
import { useAppSelector } from '../../../hooks/redux-hook';

function TransactionList(props: { transactions: Transaction[] }) {
    const { transactions } = props;

    const isCurrent = useAppSelector((state) => state.ui.budget.isCurrent);
    const transactionList = Transaction.getTransacitonsFilteredByDate({
        transactions,
        isCurrent,
    });

    return (
        <ol className={classes.container}>
            {transactionList.map((data) => {
                const { date, transactions } = data;
                return (
                    <li key={date}>
                        <ol>
                            {/* Date */}
                            <h5
                                id={getNumericHypenDateString(new Date(date))}
                                className={classes.date}
                            >
                                {date}
                            </h5>
                            {/* Transactions */}
                            {transactions.map((item: Transaction) => (
                                <TransactionItem
                                    key={item.id}
                                    transaction={item}
                                />
                            ))}
                        </ol>
                    </li>
                );
            })}
        </ol>
    );
}

export default TransactionList;
