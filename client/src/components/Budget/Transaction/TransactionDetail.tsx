import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import Amount from '../../../models/Amount';
import { transactionActions } from '../../../store/transaction';
import { getNumericDotDateString } from '../../../util/date';
import Button from '../../UI/button/Button';
import Icon from '../../UI/component/Icon';
import Overlay from '../../UI/overlay/Overlay';
import Tag from '../../UI/component/Tag';
import OverAmountMsg from './OverAmountMsg';
import classes from './TransactionDetail.module.css';
import TransactionOption from './TransactionOption';
import { css } from '@emotion/react';

interface TransactionDetailProps {
  isDefaultBudget?: boolean;
}

const detailStyle = {
  marginBottom: '4vh',
  '& > div': { display: 'flex', justifyContent: 'space-between', padding: '0.5vh 0' },
  '& dt': {
    fontWeight: 700,
  },
};

const optionButtonStyle = {
  '& button': {
    padding: 'calc(3.5rem / 2)',
    paddingLeft: 0,
  },
};

const mt2vh = {
  marginTop: '2vh',
};

function TransactionDetail({ isDefaultBudget }: TransactionDetailProps) {
  const dispatch = useAppDispatch();

  const { isOpen, transaction, category, payment } = useAppSelector(
    (state) => state.transaction.detail
  );

  const closeHandler = async () => {
    dispatch(transactionActions.closeDetail());
  };

  const getContent = () => {
    if (!transaction) return;

    const {
      isCurrent,
      isExpense,
      date,
      amount,
      linkId,
      linkedPaymentMethodId,
      overAmount,
      icon,
      title,
      tags,
      memo,
    } = transaction;

    return (
      <>
        <span className="block text-lg bold" css={css(mt2vh, { marginBottom: '6vh' })}>
          {transaction && (isCurrent ? '거래내역' : '예정내역')}
        </span>
        <div className="mvh-60 scroll">
          <div>
            <p className="text-xl semi-bold">
              {date &&
                (isDefaultBudget
                  ? `매월 ${date.getDate()}일`
                  : getNumericDotDateString(date))}
            </p>
            <p className="text-xxl extra-bold">
              {transaction && (isExpense ? '-' : '+')}
              {amount && Amount.getAmountStr(amount)}
            </p>
            {isCurrent && linkId && overAmount !== undefined ? (
              <OverAmountMsg overAmount={overAmount} />
            ) : null}
          </div>
          <div className="flex-column i-center" css={{ margin: '4vh 0' }}>
            {/* icon */}
            <Icon size="4.25rem" fontSize="2rem">
              {icon || category?.icon}
            </Icon>
            {/* category */}
            <span className="text-md bold" css={mt2vh}>
              {category?.title}
            </span>
            {/* title */}
            <span>{title?.join(' | ')}</span>
            {/* tags */}
            <ul className="flex j-center flex-wrap" css={mt2vh}>
              {tags?.map((item: any, i: number) => (
                <li key={i}>
                  <Tag className="text-md">{item}</Tag>
                </li>
              ))}
            </ul>
          </div>
          {/* detail */}
          {payment && (
            <dl css={detailStyle}>
              {payment && (
                <div>
                  <dt>결제수단</dt>
                  <dd>{payment.title}</dd>
                </div>
              )}
              {false && ( // TODO: 이벤트 개발 후 작업
                <div>
                  <dt>이벤트</dt>
                  <dd>ㅇㅇ 약속</dd>
                </div>
              )}
            </dl>
          )}
          {/* memo */}
          {memo && (
            <div
              className="p-1 bg-gray-0 text-left overflow-hidden round-sm"
              css={{ height: '2.625rem' }}
            >
              <p className="text-md break-word scroll-y" css={{ height: '2.5rem' }}>
                {memo}
              </p>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <Overlay
      id="transaction-detail"
      className="relative text-center"
      css={isOpen ? { padding: '10%' } : undefined}
      isOpen={isOpen}
      onClose={closeHandler}
    >
      {getContent()}
      <div className="flex i-center" css={{ marginTop: '4vh' }}>
        {transaction && category && (
          <TransactionOption
            transaction={transaction}
            category={category}
            onSelect={closeHandler}
            isDefaultBudget={isDefaultBudget}
            css={optionButtonStyle}
            contextStyle={{
              bottom: '0.5rem',
              left: '0.5rem',
              top: 'auto',
              right: 'auto',
            }}
          />
        )}
        <Button onClick={closeHandler}>
          닫기
        </Button>
      </div>
    </Overlay>
  );
}

export default TransactionDetail;
