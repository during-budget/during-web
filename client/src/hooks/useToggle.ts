import { useState } from 'react';
import { ObjectType } from '../types/obj';

export const useToggle = (initialValue: boolean) => {
  const [currentState, setCurrentState] = useState(initialValue);

  const setTrue = () => {
    setCurrentState(true);
  };

  const setFalse = () => {
    setCurrentState(false);
  };

  const toggle = () => {
    setCurrentState((prev) => !prev);
  };

  return [currentState, setTrue, setFalse, toggle] as const;
};

export const useToggleOptions = (initialValue: ObjectType<boolean>) => {
  const [optionState, setOptionState] = useState(initialValue);

  const setTrue = (key: string) => {
    setOptionState((prev) => {
      return {...prev, [key]: true};
    });
  };

  const setFalse = (key: string) => {
    setOptionState((prev) => {
      return {...prev, [key]: false};
    });
  };

  const toggle = (key: string) => {
    setOptionState((prev) => {
      return {...prev, [key]: !prev[key]};
    });
  };

  return [optionState, setTrue, setFalse, toggle] as const;
};
