import React, { useImperativeHandle, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/redux-hook';
import Select from '../../UI/Select';

interface PaymentInputProps {
  budgetId: string;
  className?: string;
  value?: string;
  onChange?: (value?: string, isCredit?: boolean) => void;
  defaultValue?: string;
  disabled?: boolean;
  setIsEditSetting: (isEdit: boolean) => void;
}

const PaymentInput = React.forwardRef((props: PaymentInputProps, ref) => {
  useImperativeHandle(ref, () => {
    return {
      value: () => paymentRef.current!.value(),
    };
  });
  const paymentRef = useRef<any>(null);

  const paymentMethods = useAppSelector((state) => state.asset.paymentMethods);

  const paymentOptions = [
    ...paymentMethods.map((item) => {
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
      className={props.className}
      data={paymentOptions}
      showEdit={() => {
        props.setIsEditSetting(true);
      }}
      onChange={(value?: string) => {
        const payment = paymentMethods.find((item) => item._id === value);
        props.onChange && props.onChange(value, payment?.detail === 'credit');
      }}
      value={props.value}
      defaultValue={props.defaultValue}
      disabled={props.disabled}
    />
  );
});

export default PaymentInput;
