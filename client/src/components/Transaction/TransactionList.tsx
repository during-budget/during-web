import classes from './TransactionList.module.css';
import TransactionItem from './TransactionItem';
import Transaction from '../../models/Transaction';

function TransactionList(props: {
    transactions: {
        date: Date;
        items: Transaction[];
    }[];
}) {
    return (
        <ol className={`page ${classes.list}`}>
            {props.transactions.map((transaction) => {
                return (
                    <li key={transaction.date.toISOString()}>
                        <ol>
                            <h5 className={classes.date}>
                                {transaction.date.toLocaleDateString()}
                            </h5>
                            {transaction.items.map((item) => {
                                return (
                                    <TransactionItem
                                        key={item.id}
                                        transaction={item}
                                    />
                                );
                            })}
                        </ol>
                    </li>
                );
            })}
        </ol>
    );
}

export default TransactionList;
