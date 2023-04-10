import classes from './TransactionItem.module.css';
import Amount from '../../../models/Amount';
import Transaction from '../../../models/Transaction';
import Tag from '../../UI/Tag';
import Icon from '../../UI/Icon';
import TransactionOption from './TransactionOption';
import OverAmountMsg from './OverAmountMsg';
import { transactionActions } from '../../../store/transaction';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hook';

function TransactionItem(props: { transaction: Transaction }) {
    const dispatch = useAppDispatch();

    const {
        id,
        linkId,
        icon,
        isCurrent,
        isExpense,
        titles,
        amount,
        categoryId,
        tags,
        overAmount,
    } = props.transaction;

    const categories = useAppSelector((state) => state.category);
    const category = categories?.find((item) => item.id === categoryId);

    const liClass = [
        classes.container,
        linkId && !isCurrent ? classes.done : '',
    ];

    const openDetail = (event: React.MouseEvent<HTMLLIElement>) => {
        dispatch(
            transactionActions.openDetail({
                transaction: props.transaction,
                category,
            })
        );
    };

    return (
        <li id={id} className={liClass.join(' ')} onClick={openDetail}>
            {/* icon */}
            <Icon className={classes.icon}>{icon || category?.icon}</Icon>
            <div className={classes.data}>
                <div className={classes.top}>
                    <div className={classes.left}>
                        {/* category */}
                        <p className={classes.category}>{category?.title}</p>
                        {/* title */}
                        <p className={classes.title}>{titles?.join(' | ')}</p>
                    </div>
                    {/* amount */}
                    <div className={classes.right}>
                        <div>
                            <p className={classes.amount}>
                                {isExpense ? '-' : '+'}
                                {Amount.getAmountStr(amount)}
                            </p>
                            {isCurrent && linkId && (
                                <OverAmountMsg
                                    className={classes.over}
                                    overAmount={overAmount}
                                />
                            )}
                        </div>
                        {/* TODO: !!! category! 이거 undefined있을 수 있음 처리 꼭 필요 */}
                        <TransactionOption
                            className={classes.option}
                            transaction={props.transaction}
                            category={category!}
                        />
                    </div>
                </div>
                {/* tags */}
                <div className={classes.tags}>
                    {tags &&
                        tags.map((tag: string, i) => {
                            return <Tag key={i}>{tag}</Tag>;
                        })}
                </div>
            </div>
        </li>
    );
}

export default TransactionItem;
