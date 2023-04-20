import { CategoryObjType } from '../models/Category';

// 상태관리 시 사용
export const getExpenseKey = (isExpense: boolean) => {
  return isExpense ? 'expense' : 'income';
};

// 서버에 요청보낼 때 사용
export const getExpensePlannedKey = (isExpense: boolean) => {
  return isExpense ? 'expensePlanned' : 'incomePlanned';
};

// Amount 관리 시 사용
export const getCurrentKey = (isCurrent: boolean) => {
  return isCurrent ? 'current' : 'scheduled';
};

export const getFilteredCategories = (params: {
  categoryObj: CategoryObjType;
  isExpense: boolean;
  includeDefault?: boolean;
  isDefault?: boolean;
}) => {
  const { categoryObj, isExpense, includeDefault, isDefault } = params;

  const categories = Object.values(categoryObj);

  if (includeDefault) {
    return categories.filter((item) => item.isExpense === isExpense);
  } else if (isDefault) {
    return categories.filter(
      (item) => item.isDefault === isDefault && item.isExpense === isExpense
    );
  } else {
    return categories.filter((item) => item.isExpense === isExpense && !item.isDefault);
  }
};
