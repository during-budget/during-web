import Category from '../models/Category';

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

// DefaultStatus에서 사용중인데 검토해보자
export const getFilteredCategories = (params: {
  categories: Category[];
  isExpense: boolean;
  includeDefault?: boolean;
  isDefault?: boolean;
}) => {
  const { categories, isExpense, includeDefault, isDefault } = params;

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
