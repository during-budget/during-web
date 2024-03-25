import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { uiActions } from '../../../store/ui';
import RadioTab from '../../UI/input/RadioTab';

interface CurrentTabProps {
  id: string;
  isCurrent?: boolean;
  isLine?: boolean;
  disabled?: boolean;
  isCenter?: boolean;
}

function CurrentTab({ id, isCurrent, isLine, isCenter, disabled }: CurrentTabProps) {
  const dispatch = useAppDispatch();

  const storedIsCurrent = useAppSelector((state) => state.ui.budget.isCurrent);
  const setIsCurrent = (state: boolean) => {
    dispatch(uiActions.setIsCurrent(state));
  };

  useEffect(() => {
    setIsCurrent(isCurrent || false);
  }, [isCurrent]);

  const tabs = [
    {
      label: '예정내역',
      value: 'scheduled',
      checked: !storedIsCurrent,
      onChange: () => {
        setIsCurrent(false);
      },
      disabled,
    },
    {
      label: '거래내역',
      value: 'current',
      checked: storedIsCurrent,
      onChange: () => {
        setIsCurrent(true);
      },
    },
  ];

  return (
    <RadioTab
      name={id}
      values={tabs}
      className="j-center"
      isLine={isLine}
      isCenter={isCenter}
    />
  );
}

export default CurrentTab;
