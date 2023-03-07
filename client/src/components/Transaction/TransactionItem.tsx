import { useSelector } from 'react-redux';
import classes from './TransactionItem.module.css';
import Amount from '../../models/Amount';
import Transaction from '../../models/Transaction';
import Tag from '../UI/Tag';

function TransactionItem(props: { transaction: Transaction }) {
    const {
        id,
        linkId,
        icon,
        isCurrent,
        isExpense,
        title,
        date,
        amount,
        categoryId,
        budgetId,
        tags,
        memo,
        linkAmount,
    } = props.transaction;

    const categories = useSelector((state: any) => state.category);
    const category = categories?.find((item: any) => item.id === categoryId);

    return (
        <li className={classes.container}>
            {/* icon */}
            <span className={classes.icon}>{icon || category.icon}</span>
            <div className={classes.data}>
                <div className={classes.top}>
                    <div className={classes.left}>
                        {/* category */}
                        <p className={classes.category}>{category?.title}</p>
                        {/* title */}
                        <p className={classes.title}>{title.join(' | ')}</p>
                    </div>
                    {/* amount */}
                    <p className={classes.amount}>
                        {isExpense ? '-' : '+'}
                        {Amount.getAmountStr(amount)}
                    </p>
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
