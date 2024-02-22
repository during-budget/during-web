import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../../hooks/useRedux';
import RadioTab from '../../UI/input/RadioTab';
import Select from '../../UI/input/Select';
import classes from './PaymentInput.module.css';

interface PaymentInputProps {
  budgetId: string;
  className?: string;
  value?: string;
  onChange?: (value: string, isCredit: boolean) => void;
  defaultValue?: string;
  disabled?: boolean;
  setIsEditSetting: (isEdit: boolean) => void;
  isAsset: boolean
  setIsAsset: (isAsset: boolean) => void;
}

const PaymentInput = ({
  budgetId,
  className,
  value,
  onChange,
  defaultValue,
  disabled,
  setIsEditSetting,
  isAsset,
  setIsAsset
}: PaymentInputProps) => {
  const paymentRef = useRef<any>(null);

  const isExpense = useAppSelector((state) => state.ui.budget.isExpense);
  const storedPaymentMethods = useAppSelector((state) => state.asset.paymentMethods);

  const [payments, setPayments] = useState(
    storedPaymentMethods.filter((item) => {
      if (isAsset) {
        return item.type === 'asset';
      } else {
        return item.type === 'card';
      }
    })
  );
  const [paymentTab, setPaymentTab] = useState<any>({ element: null });

  useEffect(() => {
    setIsAsset(storedPaymentMethods.find((item) => item._id === value)?.type === 'asset');
  }, [value]);

  useEffect(() => {
    setPayments(
      storedPaymentMethods.filter((item) => {
        if (isAsset) {
          return item.type === 'asset';
        } else {
          return item.type === 'card';
        }
      })
    );
    setPaymentTab({
      element: (
        <RadioTab
          className={classes.tab}
          key="payment-input-asset-card-tab"
          name="payment-input-asset-card-tab"
          values={[
            {
              label: '계좌/현금',
              value: 'asset',
              checked: isAsset,
              onChange: () => {
                setIsAsset(true);
              },
            },
            {
              label: '카드',
              value: 'card',
              checked: !isAsset,
              onChange: () => {
                setIsAsset(false);
              },
              hide: !isExpense,
            },
          ]}
        />
      ),
    });
  }, [value, isAsset]);

  useEffect(() => {
    if (isExpense) {
      setIsAsset(
        storedPaymentMethods.find((item) => item._id === value)?.type === 'asset'
      );
    } else {
      setIsAsset(true);
    }
  }, [isExpense]);

  const paymentOptions = [
    paymentTab,
    ...payments
      // .filter((item) => item.type === 'asset' || item.isChecked) // ?? 이 코드의 존재 의읭를 모르ㅜ겠음
      .map((item) => {
        return {
          value: item._id,
          label: `${item.icon} ${item.title}`,
        };
      }),
    { value: '', label: '결제수단 없음' },
  ];

  return (
    <Select
      ref={paymentRef}
      className={className}
      data={paymentOptions}
      onChange={(value?: string) => {
        localStorage.setItem('payment', value || '');
        const payment = payments.find((item) => item._id === value);
        onChange && onChange(value || '', payment?.detail === 'credit');
      }}
      value={value}
      disabled={disabled}
    />
  );
};

export default PaymentInput;
