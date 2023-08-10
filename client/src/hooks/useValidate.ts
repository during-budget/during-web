import React, { useState } from 'react';
import { ObjectType } from '../types/obj';

const useValidate = (rules: ObjectType<(value: string) => string>) => {
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  // onBlur 시 유효성 검증
  const validate = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const error = rules[name](value);

    setErrors((prev) => {
      return new Map(prev).set(name, error);
    });
  };

  const set = (key: string, value: string) => {
    setErrors((prev) => {
      return new Map(prev).set(key, value);
    });
  };

  const reset = (key?: string) => {
    if (key) {
      setErrors((prev) => {
        return new Map(prev).set(key, '');
      });
    } else {
      setErrors((prev) => {
        const nextMap = new Map(prev);
        nextMap.forEach((_, key, map) => {
          map.set(key, '');
        });
        return nextMap;
      });
    }
  };

  return [errors, validate, set, reset] as const;
};

export default useValidate;
