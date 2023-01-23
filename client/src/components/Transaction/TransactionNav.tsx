import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../../store/ui';
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
        <ul className={`nav-tab ${classes.nav}`}>
            <li>
                <input
                    id={`transaction-list-scheduled-${props.id}`}
                    type="radio"
                    name="transaction-list"
                    checked={!isCurrent}
                    disabled={props.isCompleted}
                    onChange={changeScheduledHandler}
                ></input>
                <label htmlFor={`transaction-list-scheduled-${props.id}`}>
                    예정 내역
                </label>
            </li>
            <li>
                <input
                    id={`transaction-list-current-${props.id}`}
                    type="radio"
                    name="transaction-list"
                    checked={isCurrent}
                    disabled={props.isCompleted}
                    onChange={changeCurrentHandler}
                ></input>
                <label htmlFor={`transaction-list-current-${props.id}`}>
                    거래 내역
                </label>
            </li>
        </ul>
    );
}

export default TransactionNav;
