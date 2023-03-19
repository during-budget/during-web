import { useDispatch, useSelector } from 'react-redux';
import classes from './TransactionItem.module.css';
import Amount from '../../../models/Amount';
import Transaction from '../../../models/Transaction';
import Tag from '../../UI/Tag';
import Icon from '../../UI/Icon';
import OptionButton from '../../UI/OptionButton';
import { useNavigate } from 'react-router-dom';

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
                // dispatch();
            },
        },
    ];

    const goTo = linkId && {
        name: isCurrent ? '이전 예정 내역 보기' : '완료된 거래 내역 보기',
        action: () => {
            navigate(`/budget/${budgetId}#${linkId}`);
        },
    };

    const getDone = !isCurrent &&
        !linkId && {
            name: '거래 내역으로 이동',
            action: () => {
                // dispatch();
            },
        };

    const remove = (isCurrent || !linkId) && {
        name: '내역 삭제',
        action: () => {
            // dispatch();
        },
    };

    goTo && options.unshift(goTo);
    getDone && options.unshift(getDone);
    remove && options.push(remove);

    return (
        <li id={id} className={classes.container}>
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
