import { useSelector } from 'react-redux';
import classes from './TransactionItem.module.css';
import Amount from '../../../models/Amount';
import Transaction from '../../../models/Transaction';
import Tag from '../../UI/Tag';
import Icon from '../../UI/Icon';
import TransactionOption from './TransactionOption';

function TransactionItem(props: { transaction: Transaction }) {
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

    const categories = useSelector((state: any) => state.category);
    const category = categories?.find((item: any) => item.id === categoryId);

    const liClass = [
        classes.container,
        linkId && !isCurrent ? classes.done : '',
    ];

    let overAmountMsg;
    if (overAmount < 0) {
        overAmountMsg = `계획보다 ${-1 * overAmount}원 절약`;
    } else if (overAmount > 0) {
        overAmountMsg = `계획보다 ${overAmount}원 초과`;
    } else {
        overAmountMsg = `계획대로 실행`;
    }

    return (
        <li id={id} className={liClass.join(' ')}>
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
                                <p className={classes.overAmount}>
                                    {overAmountMsg}
                                </p>
                            )}
                        </div>
                        <TransactionOption
                            className={classes.option}
                            transaction={props.transaction}
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
