import { DEFAULT_DATE_PREFIX, DEFAULT_DATE_SUFFIX } from '../../../constants/date';
import { useAppSelector } from '../../../hooks/redux-hook';
import { TransactionType } from '../../../util/api/transactionAPI';
import { getNumericHypenDateString } from '../../../util/date';
import TransactionItem from './TransactionItem';
import classes from './TransactionList.module.css';

interface Props {
  isDefault?: boolean;
}

function TransactionList({ isDefault }: Props) {
  const transactions = useAppSelector((state) => state.transaction.data);

  const isCurrent = isDefault
    ? false
    : useAppSelector((state) => state.ui.budget.isCurrent);
  const dateTransactionData = getTransacitonsFilteredByDate({
    transactions,
    isCurrent,
    isDefault,
  });

  const dateList = Object.keys(dateTransactionData);

  return (
    <ol className={`${classes.container} ${classes.default}`}>
      {dateList.map((date) => {
        const id = isDefault ? undefined : getNumericHypenDateString(new Date(date));

        return (
          <li key={date}>
            <ol>
              {/* Date */}
              <h5 id={id} className={classes.date}>
                {date}
              </h5>
              {/* Transactions */}
              {dateTransactionData[date].map((item) => (
                <TransactionItem
                  key={item._id}
                  transaction={item}
                  isDefault={isDefault}
                />
              ))}
            </ol>
          </li>
        );
      })}
    </ol>
  );
}

const getTransacitonsFilteredByDate = (data: {
  transactions: TransactionType[];
  isCurrent: boolean;
  isDefault?: boolean;
}) => {
  const { transactions, isCurrent, isDefault } = data;

  const filteredTransactions = transactions.filter((item) =>
    isCurrent ? item.isCurrent : !item.isCurrent
  );

  const dateTransactions: {
    [date: string]: TransactionType[];
  } = {};

  filteredTransactions.forEach((transaction: TransactionType) => {
    let key;

    if (!transaction.date) {
      key = '날짜 미정';
    } else if (isDefault) {
      key = DEFAULT_DATE_PREFIX + transaction.date.getDate() + DEFAULT_DATE_SUFFIX;
    } else {
      key = new Date(transaction.date).toLocaleDateString();
    }

    if (dateTransactions[key]) {
      dateTransactions[key].push(transaction);
    } else {
      dateTransactions[key] = [transaction];
    }
  });

  return dateTransactions;
};

export default TransactionList;
