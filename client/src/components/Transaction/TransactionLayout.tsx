import { useState } from 'react';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import TransactionNav from './TransactionNav';

function TransactionLayout(props: { budgetId: string }) {
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
            <TransactionList isCurrent={isCurrent} />
            <TransactionForm
                budgetId={props.budgetId}
                isCurrent={isCurrent}
                onClickScheduled={clickScheduledHandler}
                onClickCurrent={clickCurrentHandler}
            />
        </section>
    );
}

export default TransactionLayout;
