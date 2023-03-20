import { useState } from 'react';
import Transaction from '../../../models/Transaction';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import TransactionNav from './TransactionNav';

function TransactionLayout(props: {
    budgetId: string;
    transactions: Transaction[];
}) {
    return (
        <section>
            <TransactionNav id="layout" isLine={true} />
            <TransactionList transactions={props.transactions} />
            <TransactionForm budgetId={props.budgetId} />
        </section>
    );
}

export default TransactionLayout;
