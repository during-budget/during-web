import { useState } from 'react';
import Transaction from '../../models/Transaction';
import TransactionList from './TransactionList';
import TransactionNav from './TransactionNav';

function TransactionLayout(props: { transactions: Transaction[] }) {
    const [isCurrent, setIsCurrent] = useState(false);

    return (
        <section>
            <TransactionNav
                id="layout"
                isCurrent={isCurrent}
                setIsCurrent={setIsCurrent}
                isLine={true}
            />
            <TransactionList
                transactions={props.transactions}
                isCurrent={isCurrent}
            />
        </section>
    );
}

export default TransactionLayout;
