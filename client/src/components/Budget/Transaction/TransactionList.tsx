import { useAppSelector } from '../../../hooks/redux-hook';
import Transaction from '../../../models/Transaction';
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
  const dateTransactionData = Transaction.getTransacitonsFilteredByDate({
    transactions,
    isCurrent,
    isDefault,
  });

  const dateList = Object.keys(dateTransactionData);

  return (
    <ol className={classes.container}>
      {dateList.map((date) => {
        const id = isDefault
          ? undefined
          : getNumericHypenDateString(new Date(date));

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
                  key={item.id}
                  transaction={item}
                  // TODO: isDefault
                  // isDefault={true}
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
