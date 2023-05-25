import React, { useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useAppSelector } from '../../../hooks/redux-hook';
import RadioTab from '../../UI/RadioTab';
import Select from '../../UI/Select';
import classes from './PaymentInput.module.css';

interface PaymentInputProps {
  budgetId: string;
  className?: string;
  value?: string;
  onChange?: (value: string, isCredit: boolean) => void;
  defaultValue?: string;
  disabled?: boolean;
  setIsEditSetting: (isEdit: boolean) => void;
}

const PaymentInput = ({
  budgetId,
  className,
  value,
  onChange,
  defaultValue,
  disabled,
  setIsEditSetting,
}: PaymentInputProps) => {
  const [isAsset, setIsAsset] = useState(false);
  const paymentRef = useRef<any>(null);

  const storedPaymentMethods = useAppSelector((state) => state.asset.paymentMethods);
  const filteredPaymentMethods = useMemo(
    () =>
      storedPaymentMethods.filter((item) => {
        if (isAsset) {
          return item.type === 'asset';
        } else {
          return item.type === 'card';
        }
      }),
    [storedPaymentMethods, isAsset]
  );

  const paymentTab = {
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
          },
        ]}
      />
    ),
  };

  const paymentOptions = [
    paymentTab,
    ...filteredPaymentMethods
      .filter((item) => item.type === 'asset' || item.isChecked)
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
      showEdit={() => {
        setIsEditSetting(true);
      }}
      onChange={(value?: string) => {
        localStorage.setItem('payment', value || '');
        const payment = filteredPaymentMethods.find((item) => item._id === value);
        onChange && onChange(value || '', payment?.detail === 'credit');
      }}
      value={value}
      disabled={disabled}
    />
  );
};

export default PaymentInput;
