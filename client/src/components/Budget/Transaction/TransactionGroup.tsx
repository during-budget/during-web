import dayjs from 'dayjs';
import { useState } from 'react';
import { TransactionType } from '../../../util/api/transactionAPI';
import Button from '../../UI/Button';
import classes from './TransactionGroup.module.css';
import TransactionItem from './TransactionItem';

interface TransactionGroupProps {
  id?: string;
  date: string;
  data: TransactionType[];
  isDefaultBudget?: boolean;
}

const TransactionGroup = ({ id, date, data, isDefaultBudget }: TransactionGroupProps) => {
  const [isExpand, setIsExpand] = useState(true);

  return (
    <ol className={`${classes.group} ${isExpand ? classes.expand : ''}`}>
      {/* Date */}
      <div className={classes.header}>
        <h5 id={id} className={classes.date}>
          {date}
        </h5>
        <Button
          styleClass="extra"
          onClick={() => {
            setIsExpand((prev) => !prev);
          }}
        >
          {isExpand ? '↑' : '↓'}
        </Button>
      </div>
      {/* Transactions */}
      {isExpand &&
        data.map((item) => (
          <TransactionItem
            key={item._id}
            transaction={item}
            isDefaultBudget={isDefaultBudget}
          />
        ))}
    </ol>
  );
};

export default TransactionGroup;
