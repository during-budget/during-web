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
