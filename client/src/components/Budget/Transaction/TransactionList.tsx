import { DEFAULT_DATE_PREFIX, DEFAULT_DATE_SUFFIX } from '../../../constants/date';
import { useAppSelector } from '../../../hooks/useRedux';
import { TransactionType } from '../../../util/api/transactionAPI';
import { getNumericHypenDateString } from '../../../util/date';
import TransactionGroup from './TransactionGroup';

interface TransactionListProps {
  isDefault?: boolean;
  className?: string;
}

function TransactionList({ className, isDefault }: TransactionListProps) {
  const transactions = useAppSelector((state) => state.transaction.data);

  const isCurrent = isDefault
    ? false
    : useAppSelector((state) => state.ui.budget.isCurrent);
  const isExpense = useAppSelector((state) => state.ui.budget.isExpense);
  const isIncome = useAppSelector((state) => state.ui.budget.isIncome);
  const dateTransactionData = getTransacitonsFilteredByDate({
    transactions,
    isCurrent,
    isExpense,
    isIncome,
    isDefault,
  });

  const dateList = Object.keys(dateTransactionData).sort((a, b) => {
    const dayA = a.replace(/[^0-9]/g, '');
    const dayB = b.replace(/[^0-9]/g, '');
    return +dayB - +dayA;
  });

  return (
    <ol
      className={`mx-auto ${className || ''}`}
      css={{
        width: '90vw',
        paddingBottom: '8rem', // NOTE: Nav & TransactionForm Height
      }}
    >
      {dateList.map((date) => {
        const id = isDefault ? undefined : getNumericHypenDateString(new Date(date));

        return (
          <li key={date}>
            {
              <TransactionGroup
                id={id}
                date={date}
                data={dateTransactionData[date]}
                isDefaultBudget={isDefault}
              />
            }
          </li>
        );
      })}
    </ol>
  );
}

const getTransacitonsFilteredByDate = (data: {
  transactions: TransactionType[];
  isCurrent: boolean;
  isExpense: boolean;
  isIncome: boolean;
  isDefault?: boolean;
}) => {
  const { transactions, isExpense, isIncome, isDefault } = data;

  const filteredTransactions = transactions.filter(
    (item) =>
      (item.isExpense === isExpense || !item.isExpense === isIncome) &&
      (item.isCurrent ? true : !item.linkId)
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
