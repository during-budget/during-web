import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import Amount from '../../../models/Amount';
import Category from '../../../models/Category';
import { transactionActions } from '../../../store/transaction';
import { TransactionType } from '../../../util/api/transactionAPI';
import Icon from '../../UI/Icon';
import Tag from '../../UI/Tag';
import OverAmountMsg from './OverAmountMsg';
import classes from './TransactionItem.module.css';
import TransactionOption from './TransactionOption';

function TransactionItem(props: {
  transaction: TransactionType;
  isDefaultBudget?: boolean;
}) {
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
  } = props.transaction;

  const storedCategories = useAppSelector((state) =>
    isExpense ? state.budgetCategory.expense : state.budgetCategory.income
  );
  const category = storedCategories.find((item) => item.id === categoryId);

  const storedPayments = useAppSelector((state) => state.asset.paymentMethods);
  const payment = storedPayments.find((item) => item._id === linkedPaymentMethodId);

  const openDetail = (event: React.MouseEvent<HTMLLIElement>) => {
    dispatch(
      transactionActions.openDetail({
        transaction: props.transaction,
        category: category ?? Category.getEmptyCategory(),
        payment,
      })
    );
  };

  return (
    <li
      id={_id}
      className={`${classes.transactionItem} ${isCurrent ? '' : classes.scheduled}`}
      onClick={openDetail}
    >
      {/* icon */}
      <Icon className={classes.icon}>{icon || category?.icon}</Icon>
      <div className={classes.data}>
        <div className={classes.top}>
          <div className={classes.left}>
            {/* category */}
            <p className={classes.category}>{category?.title}</p>
            {/* title */}
            <p className={classes.title}>{title?.join(' | ')}</p>
          </div>
          {/* amount */}
          <div className={classes.right}>
            <div>
              <div className={classes.content}>
                {/* label */}
                {!isCurrent && <span className={classes.label}>(예정)</span>}
                <p className={classes.amount}>
                  {isExpense ? '-' : '+'}
                  {Amount.getAmountStr(amount)}
                </p>
              </div>
              {/* CHECK: isCurrent && linkId && 라는 조건이 원래 있었는데, 필요할까? 백에서 알아서 처리해줬을 거 같기도.. */}
              {overAmount !== undefined && (
                <OverAmountMsg className={classes.over} overAmount={overAmount} />
              )}
            </div>
            {/* TODO: !!! category! 이거 undefined있을 수 있음 처리 꼭 필요 */}
            <TransactionOption
              className={classes.option}
              transaction={props.transaction}
              category={category!}
              isDefaultBudget={props.isDefaultBudget}
            />
          </div>
        </div>
        {/* tags */}
        <div className={classes.tags}>
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
