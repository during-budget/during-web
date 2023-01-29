import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../../store/ui';
import RadioTab from '../UI/RadioTab';
import classes from './TransactionNav.module.css';

function TransactionNav(props: {
    id: string;
    isExpand: boolean;
    isCompleted?: boolean;
}) {
    const dispatch = useDispatch();
    const isCurrent = useSelector(
        (state: any) => state.ui.transactionForm.isCurrent
    );

    const changeScheduledHandler = () => {
        dispatch(
            uiActions.setTransactionForm({
                isExpand: props.isExpand,
                isCurrent: false,
            })
        );
    };

    const changeCurrentHandler = () => {
        dispatch(
            uiActions.setTransactionForm({
                isExpand: props.isExpand,
                isCurrent: true,
            })
        );
    };

    return (
        <RadioTab
            className={classes.nav}
            name="tansaction-list"
            values={[
                {
                    label: '예정 내역',
                    value: `scheduled-${props.id}`,
                    checked: !isCurrent,
                    disabled: props.isCompleted,
                    onChange: changeScheduledHandler,
                },
                {
                    label: '거래 내역',
                    value: `current-${props.id}`,
                    checked: isCurrent,
                    disabled: props.isCompleted,
                    onChange: changeCurrentHandler,
                },
            ]}
        />
    );
}

export default TransactionNav;
