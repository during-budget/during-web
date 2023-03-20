import { useDispatch, useSelector } from 'react-redux';
import classes from './TransactionItem.module.css';
import Amount from '../../../models/Amount';
import Transaction from '../../../models/Transaction';
import Tag from '../../UI/Tag';
import Icon from '../../UI/Icon';
import OptionButton from '../../UI/OptionButton';
import { useNavigate } from 'react-router-dom';
import { transactionActions } from '../../../store/transaction';
import { getNumericHypenDateString } from '../../../util/date';
import { budgetActions } from '../../../store/budget';
import { deleteTransaction } from '../../../util/api/transactionAPI';
import { uiActions } from '../../../store/ui';

function TransactionItem(props: { transaction: Transaction }) {
    const {
        id,
        linkId,
        icon,
        isCurrent,
        isExpense,
        titles,
        date,
        amount,
        categoryId,
        budgetId,
        tags,
        memo,
        linkAmount,
    } = props.transaction;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const categories = useSelector((state: any) => state.category);
    const category = categories?.find((item: any) => item.id === categoryId);

    const options = [
        {
            name: '내역 수정',
            action: () => {
                dispatch(
                    transactionActions.setForm({
                        mode: { isExpand: true, isEdit: true },
                        default: {
                            id,
                            linkId,
                            icon,
                            isCurrent,
                            isExpense,
                            titles,
                            date: getNumericHypenDateString(date),
                            amount,
                            categoryId,
                            tags,
                            memo,
                            linkAmount,
                        },
                    })
                );
            },
        },
    ];

    const goTo = linkId && {
        name: isCurrent ? '이전 예정 내역 보기' : '완료된 거래 내역 보기',
        action: async () => {},
    };

    const getDone = !isCurrent &&
        !linkId && {
            name: '거래내역으로 등록',
            action: () => {
                dispatch(uiActions.setIsCurrent(true));
                dispatch(
                    transactionActions.setForm({
                        mode: { isExpand: true, isDone: true },
                        default: {
                            linkId: id,
                            icon,
                            isCurrent: true,
                            isExpense,
                            titles,
                            date: getNumericHypenDateString(date),
                            amount,
                            categoryId,
                            tags,
                            memo,
                        },
                    })
                );
            },
        };

    const remove = (isCurrent || !linkId) && {
        name: '내역 삭제',
        action: () => {
            // remove
            if (isCurrent && linkId) {
                dispatch(transactionActions.removeLink(linkId));
            }

            dispatch(transactionActions.removeTransaction(id));
            deleteTransaction(id);

            // amount
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
        },
    };

    goTo && options.unshift(goTo);
    getDone && options.unshift(getDone);
    remove && options.push(remove);

    const liClass = [
        classes.container,
        linkId && !isCurrent ? classes.done : '',
    ];

    return (
        <li id={id} className={liClass.join(' ')}>
            {/* icon */}
            <Icon>{icon || category?.icon}</Icon>
            <div className={classes.data}>
                <div className={classes.top}>
                    <div className={classes.left}>
                        {/* category */}
                        <p className={classes.category}>{category?.title}</p>
                        {/* title */}
                        <p className={classes.title}>{titles?.join(' | ')}</p>
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
            {/* <div className={classes.testWrapper}></div> */}
            <OptionButton className={classes.option} menu={options} />
        </li>
    );
}

export default TransactionItem;
