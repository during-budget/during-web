import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';
import { uiActions } from '../../../store/ui';
import RadioTab from '../../UI/RadioTab';

interface CurrentTabProps {
  id: string;
  isLine?: boolean;
  disabled?: boolean;
  isCenter?: boolean;
}

function CurrentTab({ id, isLine, isCenter, disabled }: CurrentTabProps) {
  const dispatch = useAppDispatch();

  const isCurrent = useAppSelector((state) => state.ui.budget.isCurrent);
  const setIsCurrent = (state: boolean) => {
    dispatch(uiActions.setIsCurrent(state));
  };

  const tabs = [
    {
      label: '예정내역',
      value: 'scheduled',
      checked: !isCurrent,
      onChange: () => {
        setIsCurrent(false);
      },
      disabled,
    },
    {
      label: '거래내역',
      value: 'current',
      checked: isCurrent,
      onChange: () => {
        setIsCurrent(true);
      },
    },
  ];

  return <RadioTab name={id} values={tabs} isLine={isLine} isCenter={isCenter} />;
}

export default CurrentTab;
