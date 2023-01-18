import classes from './TransactionItem.module.css';
import Tag from '../UI/Tag';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Transaction from '../../models/Transaction';

function TransactionItem(props: { transaction: Transaction }) {
    const navigation = useNavigate();
    const [isShowOverlay, setIsShowOverlay] = useState(false);

    const { id, icon, title, amount, categoryId, tags } = props.transaction;

    const clickHandler = () => {
        navigation(`/budget/01/${id}`);
        setIsShowOverlay(true);
    };

    return (
        <li className={classes.item} onClick={clickHandler}>
            <div className={classes.info}>
                <span className={classes.icon}>{icon}</span>
                <div className={classes.detail}>
                    <div className={classes.header}>
                        <p className={classes.category}>
                            {categoryId}
                        </p>
                        <p className={classes.title}>{title.join(' | ')}</p>
                    </div>
                    <div className={classes.amount}>
                        {amount.toLocaleString() + '원'}
                    </div>
                </div>
            </div>
            <div className={classes.tags}>
                {tags
                    ? tags.map((tag: string) => {
                          return <Tag key={tag}>{tag}</Tag>;
                      })
                    : null}
            </div>
        </li>
    );
}

export default TransactionItem;
