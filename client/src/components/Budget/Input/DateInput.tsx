import React, { useImperativeHandle, useRef } from 'react';

interface DateInputProps {
  className: string;
  defaultValue?: Date | null;
  required?: boolean;
}

const DateInput = React.forwardRef(
  ({ className, defaultValue, required }: DateInputProps, ref) => {
    useImperativeHandle(ref, () => {
      return {
        value: () => dateRef.current!.value,
      };
    });

    const dateRef = useRef<HTMLInputElement>(null);

    return (
      <input
        className={className}
        ref={dateRef}
        type="datetime-local"
        placeholder="날짜를 입력하세요"
        defaultValue={
          defaultValue?.toISOString().slice(0, 16) ||
          new Date().toISOString().slice(0, 16)
        }
        required={required}
      />
    );
  }
);

export default DateInput;
