import dayjs from 'dayjs';
import React from 'react';

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
          ? dayjs(value).format('YYYY-MM-DD')
          : dayjs(new Date(0, 0, 1)).format('YYYY-MM-DD')
      }
      onChange={dateTimeHandler}
      required={required}
    >
      {dateList.map((item) => (
        <option key={item} value={dayjs(new Date(0, 0, item)).format('YYYY-MM-DD')}>
          매월 {item}일
        </option>
      ))}
    </select>
  );
};

export default DateSelector;
