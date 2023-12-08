import React from 'react';

interface YearPickerProps {
  onSelect: any;
  fontSize: string;
  className?: string;
}

const YearPicker = ({ className, onSelect, fontSize }: YearPickerProps) => {
  const currentYear = new Date().getFullYear();
  const options = [];

  for (let i = 2000; i <= currentYear; i++) {
    options.push(i);
  }

  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onSelect) {
      onSelect(event.target.value);
    }
  };

  return (
    <div className={`flex i-center extra-bold ${className}`}>
      <select
        className="content-box w-auto bg-trans extra-heavy"
        onChange={changeHandler}
        defaultValue={currentYear}
        style={{ fontSize }}
      >
        {options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
      <span>↓</span>
    </div>
  );
};

export default YearPicker;
