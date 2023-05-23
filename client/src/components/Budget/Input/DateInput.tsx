import React from 'react';

interface DateInputProps {
  className: string;
  value: Date | null;
  onChange: React.Dispatch<React.SetStateAction<Date | null>>;
  required?: boolean;
}

const DateInput = ({ className, value, onChange, required }: DateInputProps) => {
  const dateTimeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(new Date(event.target.value));
  };

  return (
    <input
      className={className}
      type="datetime-local"
      placeholder="날짜를 입력하세요"
      value={value?.toISOString().slice(0, 16) || new Date().toISOString().slice(0, 16)}
      onChange={dateTimeHandler}
      required={required}
    />
  );
};

export default DateInput;
