import { useState } from 'react';
import { useSelector } from 'react-redux';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import TransactionNav from './TransactionNav';

function TransactionLayout() {
    const { current, scheduled } = useSelector(
        (state: any) => state.budget.transactions
    );
    const [isCurrent, setIsCurrent] = useState(false);

    const clickScheduledHandler = () => {
        setIsCurrent(false);
    };

    const clickCurrentHandler = () => {
        setIsCurrent(true);
    };

    return (
        <section>
            <TransactionNav
                isCurrent={isCurrent}
                onClickScheduled={clickScheduledHandler}
                onClickCurrent={clickCurrentHandler}
            />
            <TransactionList transactions={isCurrent ? current : scheduled} />
            <TransactionForm
                isCurrent={isCurrent}
                onClickScheduled={clickScheduledHandler}
                onClickCurrent={clickCurrentHandler}
            />
        </section>
    );
}

export default TransactionLayout;
