import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import Amount from '../../../models/Amount';
import Category from '../../../models/Category';
import { transactionActions } from '../../../store/transaction';
import { TransactionType } from '../../../util/api/transactionAPI';
import Icon from '../../UI/component/Icon';
import Tag from '../../UI/component/Tag';
import OverAmountMsg from './OverAmountMsg';
import classes from './TransactionItem.module.css';
import TransactionOption from './TransactionOption';

interface TransactionItemProps {
  transaction: TransactionType;
  isDefaultBudget?: boolean;
}

function TransactionItem({ transaction, isDefaultBudget }: TransactionItemProps) {
  const dispatch = useAppDispatch();

  const {
    _id,
    linkId,
    icon,
    isCurrent,
    isExpense,
    title,
    amount,
    categoryId,
    linkedPaymentMethodId,
    tags,
    overAmount,
  } = transaction;

  const storedCategories = useAppSelector((state) =>
    isExpense ? state.budgetCategory.expense : state.budgetCategory.income
  );
  const category =
    storedCategories.find((item) => item.id === categoryId) ??
    Category.getEmptyCategory();

  const storedPayments = useAppSelector((state) => state.asset.paymentMethods);
  const payment = storedPayments.find((item) => item._id === linkedPaymentMethodId);

  const openDetail = (event: React.MouseEvent<HTMLLIElement>) => {
    dispatch(
      transactionActions.openDetail({
        transaction,
        category,
        payment,
      })
    );
  };

  return (
    <li
      id={_id}
      className={`flex i-center gap-sm mb-1 pointer ${
        isCurrent ? '' : 'bg-gray-0 round-md'
      }`}
      css={isCurrent ? undefined : { padding: '2vw' }}
      onClick={openDetail}
    >
      {/* icon */}
      <Icon>{icon || category?.icon}</Icon>
      <div className="w-100" css={{ flex: '1 1 auto' }}>
        <div className="w-100 flex j-between i-center gap-md pt-0.5">
          <div className="shrink-1">
            {/* category */}
            <p className="text-sm bold">{category?.title}</p>
            {/* title */}
            <p className="text-md">{title?.join(' | ')}</p>
          </div>
          {/* amount */}
          <div className="flex shrink-0">
            <div className="flex-column i-end">
              <div className="flex i-center gap-xs">
                {/* label */}
                {!isCurrent && <span className="text-ms">(예정)</span>}
                <p className="flex shrink-0 text-ml semi-bold text-right">
                  {isExpense ? '-' : '+'}
                  {Amount.getAmountStr(amount)}
                </p>
              </div>
              {/* CHECK: isCurrent && linkId && 라는 조건이 원래 있었는데, 필요할까? 백에서 알아서 처리해줬을 거 같기도.. */}
              {overAmount !== undefined && (
                <OverAmountMsg className="text-xs" overAmount={overAmount} />
              )}
            </div>
            <TransactionOption
              css={{ '& button': { paddingLeft: '1rem' } }}
              transaction={transaction}
              category={category}
              isDefaultBudget={isDefaultBudget}
            />
          </div>
        </div>
        {/* tags */}
        <div className="mt-0.5 flex flex-wrap gap-xs text-sm">
          {tags &&
            tags.map((tag: string, i) => {
              return <Tag key={i}>{tag}</Tag>;
            })}
        </div>
      </div>
    </li>
  );
}

export default TransactionItem;
