import classes from './BasicBudget.module.css';
import TransactionForm from '../../Budget/Transaction/TransactionForm';
import TransactionList from '../../Budget/Transaction/TransactionList';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { uiActions } from '../../../store/ui';

function BasicBudget() {
    const dispatch = useDispatch();

    const id = useSelector((state: any) => state.user.basicBudgetId);

    useEffect(() => {
        dispatch(uiActions.setIsCurrent(false));
    }, []);

    return (
        <main className={classes.container}>
            <section></section>
            <hr />
            <section>
                <TransactionList transactions={[]} />
                <TransactionForm budgetId={id} isBasic={true} />
            </section>
        </main>
    );
}

export default BasicBudget;
