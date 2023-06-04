import React from 'react';
import { getNumericHypenDateString } from '../../../util/date';

interface DateSelectorProps {
  className: string;
  value: Date;
  onChange: React.Dispatch<React.SetStateAction<Date>>;
  required?: boolean;
}

const DateSelector = ({ className, value, onChange, required }: DateSelectorProps) => {
  const dateList = [...Array(31).keys()].map((i) => i + 1);

  const dateTimeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(new Date(event.target.value));
  };

  return (
    <select
      className={className}
      value={
        value && !isNaN(value.valueOf())
          ? getNumericHypenDateString(value)
          : getNumericHypenDateString(new Date(0, 0, 1))
      }
      onChange={dateTimeHandler}
      required={required}
    >
      {dateList.map((item) => (
        <option key={item} value={getNumericHypenDateString(new Date(0, 0, item))}>
          매월 {item}일
        </option>
      ))}
    </select>
  );
};

export default DateSelector;
