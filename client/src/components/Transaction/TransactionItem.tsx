import classes from './TransactionItem.module.css';
import Tag from '../UI/Tag';
import { useNavigate } from 'react-router-dom';
import Transaction from '../../models/Transaction';
import { useSelector } from 'react-redux';
import Amount from '../../models/Amount';
import OptionButton from '../UI/OptionButton';

function TransactionItem(props: { transaction: Transaction }) {
    const navigation = useNavigate();

    const { id, icon, title, amount, categoryId, budgetId, tags } =
        props.transaction;

    const categories = useSelector((state: any) => state.categories);
    const category = categories.find((item: any) => item.id === categoryId);

    if (!category) {
        throw new Error("Category doesn't exists");
    }

    const contextMenu = [
        {
            name: '거래 내역으로 이동',
            action: () => {},
        },
        {
            name: '내역 수정',
            action: () => {},
        },
        {
            name: '내역 삭제',
            action: () => {},
        },
    ];

    const navigateHandler = () => {
        navigation(`/budget/${budgetId}/${id}`);
    };

    return (
        <li className={classes.item}>
            <div className={classes.data} onClick={navigateHandler}>
                <div className={classes.info}>
                    <span className={classes.icon}>
                        {icon || category.icon}
                    </span>
                    <div className={classes.detail}>
                        <div className={classes.header}>
                            <p className={classes.category}>{category.title}</p>
                            <p className={classes.title}>{title.join(' | ')}</p>
                        </div>
                        <div className={classes.amount}>
                            {Amount.getAmountString(amount)}
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
            </div>
            <OptionButton menu={contextMenu} />
        </li>
    );
}

export default TransactionItem;
