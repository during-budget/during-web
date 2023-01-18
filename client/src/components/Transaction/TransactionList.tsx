import classes from './TransactionList.module.css';
import TransactionItem from './TransactionItem';
import Transaction from '../../models/Transaction';

function TransactionList(props: { transactions: Transaction[] }) {
    const transactions: { date: string; transactions: Transaction[] }[] = [];
    props.transactions.forEach((transaction) => {
        const date = transaction.date.toLocaleDateString('ko-KR');
        const target = transactions.find((item) => item.date === date);
        if (target) {
            target.transactions.push(transaction);
        } else {
            transactions.push({ date, transactions: [transaction] });
        }
    });

    return (
        <ol className={`page ${classes.list}`}>
            {transactions.map((transaction) => {
                return (
                    <li key={transaction.date}>
                        <ol>
                            <h5 className={classes.date}>{transaction.date}</h5>
                            {transaction.transactions.map((item) => {
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
