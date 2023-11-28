import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/useRedux';
import { assetActions } from '../../../store/asset';
import { PaymentDataType, updatePayments } from '../../../util/api/assetAPI';
import DraggableItem from '../../UI/DraggableItem';
import DraggableList from '../../UI/DraggableList';
import Icon from '../../UI/Icon';
import OverlayForm from '../../UI/overlay/OverlayForm';
import classes from './PaymentEditor.module.css';

interface PaymentEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentEditor = ({ isOpen, onClose }: PaymentEditorProps) => {
  const dispatch = useDispatch();

  const payments = useAppSelector((state) => state.asset.paymentMethods);

  const [listState, setListState] = useState<PaymentDataType[]>(payments);

  const submitHandler = async () => {
    const { paymentMethods } = await updatePayments(listState);
    dispatch(assetActions.setPaymentMethods(paymentMethods));

    onClose();
  };

  const checkHandler = (idx: number) => {
    setListState((prev) => {
      const next = [...prev];

      const target = { ...next[idx] };
      target.isChecked = !target.isChecked;

      next[idx] = target;
      return next;
    });
  };

  return (
    <OverlayForm
      onSubmit={submitHandler}
      overlayOptions={{
        id: 'payment-editor',
        isOpen,
        onClose,
        noTransform: true,
        lockBody: true,
      }}
      className={classes.paymentEditor}
    >
      <h5>결제수단 목록 편집</h5>
      <DraggableList
        id="payment-list-editor"
        list={listState}
        setList={setListState}
        className={classes.list}
      >
        {listState.map((item, i) => (
          <DraggableItem
            key={item._id}
            id={item._id}
            idx={i}
            checked={item.isChecked}
            onCheck={checkHandler}
          >
            <div className={classes.data}>
              <Icon>{item.icon}</Icon>
              <span>{item.title}</span>
            </div>
          </DraggableItem>
        ))}
      </DraggableList>
    </OverlayForm>
  );
};

export default PaymentEditor;
