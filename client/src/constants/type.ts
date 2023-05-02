export type DetailTablValueType =
  | 'all'
  | 'account'
  | 'cash'
  | 'etc'
  | 'debit'
  | 'credit'
  | 'prepaid';

export const ASSET_CARD_DETAIL_TYPE = {
  all: '전체',
  account: '계좌',
  cash: '현금',
  etc: '기타',
  debit: '체크카드',
  credit: '신용카드',
  prepaid: '선불카드',
};
