import classes from './TransactionList.module.css';
import TransactionItem from './TransactionItem';
import Transaction from '../../models/Transaction';
import { useSelector } from 'react-redux';

function TransactionList(props: { budgetId: string }) {
    const totalTransacitons = useSelector((state: any) => state.transactions);
    const isCurrentState = useSelector(
        (state: any) => state.ui.transactionForm.isCurrent
    );

    const filteredTransactions = totalTransacitons.filter((item: any) => {
        const isBudget = item.budgetId === props.budgetId;
        const isCorrectType = isCurrentState ? item.isCurrent : !item.isCurrent;
        return isBudget && isCorrectType;
    });

    const transactions: { date: string; transactions: Transaction[] }[] = [];
    filteredTransactions.forEach((transaction: any) => {
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
                            <h5
                                className={classes.date}
                                id={new Date(
                                    transaction.date
                                ).toLocaleDateString('sv-SE')}
                            >
                                {transaction.date}
                            </h5>
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
