import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../../../store/ui';
import RadioTab from '../../UI/RadioTab';

function TransactionNav(props: {
    id: string;
    isLine?: boolean;
    disabled?: boolean;
}) {
    const dispatch = useDispatch();

    const isCurrent = useSelector((state: any) => state.ui.budget.isCurrent);
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
            disabled: props.disabled,
        },
        {
            label: '거래내역',
            value: 'current',
            checked: isCurrent,
            onChange: () => {
                setIsCurrent(true);
            },
            disabled: props.disabled,
        },
    ];

    return <RadioTab name={props.id} values={tabs} isLine={props.isLine} />;
}

export default TransactionNav;
