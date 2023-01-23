import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../../store/ui';
import classes from './TransactionNav.module.css';

function TransactionNav(props: { id: string; isExpand: boolean }) {
    const dispatch = useDispatch();
    const isCurrent = useSelector(
        (state: any) => state.ui.transactionForm.isCurrent
    );

    const clickScheduledHandler = () => {
        dispatch(
            uiActions.setTransactionForm({
                isExpand: props.isExpand,
                isCurrent: false,
            })
        );
    };

    const clickCurrentHandler = () => {
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
                    readOnly
                ></input>
                <label
                    htmlFor={`transaction-list-scheduled-${props.id}`}
                    onClick={clickScheduledHandler}
                >
                    예정 내역
                </label>
            </li>
            <li>
                <input
                    id={`transaction-list-current-${props.id}`}
                    type="radio"
                    name="transaction-list"
                    checked={isCurrent}
                    readOnly
                ></input>
                <label
                    htmlFor={`transaction-list-current-${props.id}`}
                    onClick={clickCurrentHandler}
                >
                    거래 내역
                </label>
            </li>
        </ul>
    );
}

export default TransactionNav;
