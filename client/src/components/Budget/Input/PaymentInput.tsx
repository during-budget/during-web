import React, { useImperativeHandle, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/redux-hook';
import Select from '../../UI/Select';

interface PaymentInputProps {
  budgetId: string;
  className?: string;
  value?: string;
  onChange?: (value?: string) => void;
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

  const dispatch = useDispatch();
  const paymentRef = useRef<any>(null);

  const paymentMethods = useAppSelector((state) => state.asset.paymentMethods);

  const paymentOptions = [
    { value: '', label: '결제수단 없음' },
    ...paymentMethods.map((item) => {
      return {
        value: item._id,
        label: `${item.icon} ${item.title}`,
      };
    }),
  ];

  return (
    <Select
      ref={paymentRef}
      className={props.className}
      data={paymentOptions}
      // showEdit={() => {
      //   dispatch(uiActions.setIsExpense(isExpense));
      //   props.setIsEditSetting(true);
      // }}
      onChange={props.onChange}
      value={props.value}
      defaultValue={props.defaultValue}
      disabled={props.disabled}
    />
  );
});

export default PaymentInput;
