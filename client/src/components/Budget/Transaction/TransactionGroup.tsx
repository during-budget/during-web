import { useState } from 'react';
import { TransactionType } from '../../../util/api/transactionAPI';
import Button from '../../UI/button/Button';
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
    <ol className={`mb-1 ${isExpand ? 'mb-3' : ''}`}>
      {/* Date */}
      <div className="flex j-between i-center">
        <h5 id={id} className="shrink-0" css={{ scrollMargin: '10vh' }}>
          {date}
        </h5>
        <Button
          styleClass="extra"
          className="w-auto"
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
