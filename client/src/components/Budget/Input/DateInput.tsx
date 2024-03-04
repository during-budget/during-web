import React from 'react';
import { getNumericHypenDateString } from '../../../util/date';
import { useAppSelector } from '../../../hooks/useRedux';

interface DateInputProps {
  className: string;
  value: Date | null;
  onChange: React.Dispatch<React.SetStateAction<Date>>;
  required?: boolean;
}

const DateInput = ({ className, value, onChange, required }: DateInputProps) => {
  const { date } = useAppSelector((state) => state.budget.current);
  
  const dateTimeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(new Date(event.target.value));
  };

  return (
    <input
      className={className}
      type="datetime-local"
      placeholder="날짜를 입력하세요"
      value={
        value && !isNaN(value.valueOf())
          ? getNumericHypenDateString(value)
          : getNumericHypenDateString(new Date())
      }
      onChange={dateTimeHandler}
      min={getNumericHypenDateString(date.start)}
      max={getNumericHypenDateString(date.end)}
      required={required}
    />
  );
};

export default DateInput;
