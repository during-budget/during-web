import { useState } from 'react';
import Amount from '../../../models/Amount';
import RadioTab from '../../UI/input/RadioTab';
import classes from './AmountDetail.module.css';
import AmountDetailItem from './AmountDetailItem';

interface AmountDetailProps {
  id: string;
  amount: Amount;
  editPlanHandler?: (amount: string) => void;
}

const AmountDetail = ({ id, amount, editPlanHandler }: AmountDetailProps) => {
  const [isLeft, setIsLeft] = useState(false);

  const tabs = [
    {
      label: '전체 금액',
      value: 'total',
      checked: !isLeft,
      onChange: () => {
        setIsLeft(false);
      },
    },
    {
      label: '남은 금액',
      value: 'left`',
      checked: isLeft,
      onChange: () => {
        setIsLeft(true);
      },
    },
  ];

  const details = [
    {
      label: isLeft ? '예정 가능' : '예정 금액',
      amountStr: amount.getScheduledStr(isLeft),
      labelColor: 'var(--secondary)',
      fontSize: '1.125rem',
      fontWeight: 400,
    },
    {
      label: '현재 금액',
      amountStr: amount.getCurrentStr(),
      labelColor: 'var(--primary)',
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    {
      label: isLeft ? '남은 목표' : '목표 금액',
      amountStr: amount.getPlannedStr(isLeft),
      labelColor: 'var(--gray-1)',
      fontSize: '1.125rem',
      fontWeight: 100,
      editHandler: editPlanHandler,
    },
  ];

  return (
    <div className={classes.container}>
      <RadioTab name={`${id}-amount-detail`} values={tabs} isBold={false} />
      <ul>
        {details.map((data, i) => (
          <AmountDetailItem
            key={i}
            labelColor={data.labelColor}
            fontWeight={data.fontWeight}
            fontSize={data.fontSize}
            label={data.label}
            amountStr={data.amountStr}
            editHandler={data.editHandler}
          />
        ))}
      </ul>
    </div>
  );
};

export default AmountDetail;
