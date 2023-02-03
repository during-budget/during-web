import classes from './TransactionItem.module.css';
import Tag from '../UI/Tag';
import { useNavigate } from 'react-router-dom';
import Transaction from '../../models/Transaction';
import { useSelector, useDispatch } from 'react-redux';
import Amount from '../../models/Amount';
import OptionButton from '../UI/OptionButton';
import { transactionActions } from '../../store/transaction';
import { uiActions } from '../../store/ui';
import { budgetActions } from '../../store/budget';
import { deleteTransaction } from '../../util/api';

function TransactionItem(props: { transaction: Transaction }) {
    const dispatch = useDispatch();
    const navigation = useNavigate();

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
    } = props.transaction;

    const categories = useSelector((state: any) => state.categories);
    const category = categories.find((item: any) => item.id === categoryId);

    if (!category) {
        throw new Error("Category doesn't exists");
    }

    const contextMenu = [
        {
            name: '내역 수정',
            action: () => {
                dispatch(
                    uiActions.setTransactionForm({
                        id,
                        linkId,
                        isExpand: true,
                        isEdit: true,
                        isExpense,
                        input: {
                            amount,
                            icon,
                            title,
                            date: date.toLocaleDateString('sv-SE'),
                            categoryId,
                            tags,
                            memo,
                        },
                    })
                );
            },
        },
        {
            name: '내역 삭제',
            action: () => {
                dispatch(transactionActions.removeTransaction(id));
                dispatch(
                    budgetActions.updateTotalAmount({
                        budgetId,
                        isExpense,
                        isCurrent,
                        amount: -amount,
                    })
                );
                dispatch(
                    budgetActions.updateCategoryAmount({
                        budgetId,
                        categoryId,
                        isCurrent,
                        amount: -amount,
                    })
                );
                deleteTransaction(id);
            },
        },
    ];

    const getDone = !isCurrent &&
        !linkId && {
            name: '거래 내역으로 이동',
            action: () => {
                dispatch(
                    uiActions.setTransactionForm({
                        id,
                        isExpand: true,
                        isEdit: false,
                        isCurrent: true,
                        isCompleted: true,
                        isExpense: isExpense,
                        input: {
                            amount,
                            icon,
                            title,
                            date: date.toLocaleDateString('sv-SE'),
                            categoryId,
                            tags,
                            memo,
                        },
                    })
                );
            },
        };

    const goToLink = linkId && {
        name: isCurrent ? '이전 예정 내역 보기' : '완료된 거래 내역 보기',
        action: () => {
            navigation(`/budget/${budgetId}/${linkId}`);
        },
    };

    getDone && contextMenu.unshift(getDone);
    goToLink && contextMenu.unshift(goToLink);

    const navigateHandler = () => {
        navigation(`/budget/${budgetId}/${id}`);
    };

    const itemClassName =
        !isCurrent && linkId
            ? `${classes.item} ${classes.completed}`
            : classes.item;

    return (
        <li className={itemClassName}>
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
                            {isExpense ? '-' : '+'}
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
