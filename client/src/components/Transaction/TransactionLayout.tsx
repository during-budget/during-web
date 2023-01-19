import { useState } from 'react';
import { useSelector } from 'react-redux';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import TransactionNav from './TransactionNav';

function TransactionLayout(props: { budgetId: string; isRepeating: boolean }) {
    const [isCurrent, setIsCurrent] = useState(false);

    const totalTransacitons = useSelector((state: any) => state.transactions);
    const transactions = totalTransacitons.filter((item: any) =>
        isCurrent ? item.isCurrent : !item.isCurrent
    );

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
            <TransactionList transactions={transactions} />
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
