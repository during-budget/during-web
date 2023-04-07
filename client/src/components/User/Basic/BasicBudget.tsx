import classes from './BasicBudget.module.css';
import TransactionForm from '../../Budget/Transaction/TransactionForm';
import TransactionList from '../../Budget/Transaction/TransactionList';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { uiActions } from '../../../store/ui';
import NavButton from '../../UI/NavButton';
import { useLocation } from 'react-router';

function BasicBudget() {
    const dispatch = useDispatch();
    const location = useLocation();

    const from = location.state?.from?.pathname;

    const id = useSelector((state: any) => state.user.basicBudgetId);

    useEffect(() => {
        dispatch(uiActions.setIsCurrent(false));
    }, []);

    return (
        <main className={classes.container}>
            <NavButton
                className={classes.back}
                to={from || '/user'}
                isNext={false}
            />
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
