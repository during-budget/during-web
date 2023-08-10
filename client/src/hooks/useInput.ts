import React, { useState } from 'react';

const useInput = () => {
  const [values, setValues] = useState<Map<string, string>>(new Map());
  const [disabled, setDisabled] = useState<Map<string, boolean>>(new Map());

  // 입력값 세팅
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (disabled.get(name)) {
      return;
    }

    setValues((prev) => {
      return new Map(prev).set(name, value);
    });
  };

  const resetHandler = (key?: string) => {
    if (key) {
      setValues((prev) => {
        return new Map(prev).set(key, '');
      });
    } else {
      setValues((prev) => {
        const nextMap = new Map(prev);
        nextMap.forEach((_, key, map) => {
          map.set(key, '');
        });
        return nextMap;
      });
    }
  };

  return [values, changeHandler, setValues, resetHandler] as const;
};

export default useInput;
