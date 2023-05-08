import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import Amount from '../../../models/Amount';
import { transactionActions } from '../../../store/transaction';
import { getNumericDotDateString } from '../../../util/date';
import Button from '../../UI/Button';
import Icon from '../../UI/Icon';
import Overlay from '../../UI/Overlay';
import Tag from '../../UI/Tag';
import OverAmountMsg from './OverAmountMsg';
import classes from './TransactionDetail.module.css';
import TransactionOption from './TransactionOption';

interface Props {
  isDefault?: boolean;
}

function TransactionDetail({ isDefault }: Props) {
  const dispatch = useAppDispatch();

  const { isOpen, transaction, category } = useAppSelector(
    (state) => state.transaction.detail
  );

  const closeHandler = async () => {
    dispatch(transactionActions.closeDetail());
  };

  // TODO: 에러 처리 제대로
  if (!transaction) {
    return <p>내역이 존재하지 않습니다.</p>;
  }

  const { isCurrent, isExpense, date, amount, linkId, overAmount, icon, title, tags, memo } = transaction;

  return (
    <Overlay
      className={`${classes.container} ${isOpen ? classes.open : ''}`}
      isOpen={isOpen}
      closeHandler={closeHandler}
    >
      <span className={classes.type}>
        {transaction && (isCurrent ? '거래내역' : '예정내역')}
      </span>
      <div className={classes.content}>
        <div>
          <p className={classes.date}>
            {date &&
              (isDefault ? `매월 ${date.getDate()}일` : getNumericDotDateString(date))}
          </p>
          <p className={classes.amount}>
            {transaction && (isExpense ? '-' : '+')}
            {amount && Amount.getAmountStr(amount)}
          </p>
          {isCurrent && linkId && overAmount !== undefined ? (
            <OverAmountMsg className={classes.over} overAmount={overAmount} />
          ) : null}
        </div>
        <div className={classes.main}>
          <Icon size="5rem" fontSize="2.5rem">
            {icon || category?.icon}
          </Icon>
          <span className={classes.category}>{category?.title}</span>
          <span className={classes.titles}>{title?.join(' | ')}</span>
          <ul className={classes.tags}>
            {tags?.map((item: any, i: number) => (
              <li key={i}>
                <Tag>{item}</Tag>
              </li>
            ))}
          </ul>
        </div>
        {false && ( // TODO: 결제수단, 이벤트 개발 후 작업
          <dl className={classes.detail}>
            <div>
              <dt>결제수단</dt>
              <dd>삼성카드</dd>
            </div>
            <div>
              <dt>이벤트</dt>
              <dd>ㅇㅇ 약속</dd>
            </div>
          </dl>
        )}
        {memo && (
          <div className={classes.memo}>
            <p>{memo}</p>
          </div>
        )}
      </div>
      <div className={classes.buttons}>
        {transaction && category && (
          <TransactionOption
            transaction={transaction}
            category={category}
            onSelect={closeHandler}
            isDefault={isDefault}
            className={classes.option}
            contextStyle={{
              bottom: '0.5rem',
              left: '0.5rem',
              top: 'auto',
              right: 'auto',
            }}
          />
        )}
        <Button className={classes.close} onClick={closeHandler}>
          닫기
        </Button>
      </div>
    </Overlay>
  );
}

export default TransactionDetail;
