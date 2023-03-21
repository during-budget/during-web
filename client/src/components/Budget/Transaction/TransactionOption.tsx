import { useDispatch } from 'react-redux';
import Transaction from '../../../models/Transaction';
import { budgetActions } from '../../../store/budget';
import { transactionActions } from '../../../store/transaction';
import { uiActions } from '../../../store/ui';
import { deleteTransaction } from '../../../util/api/transactionAPI';
import { getNumericHypenDateString } from '../../../util/date';
import OptionButton from '../../UI/OptionButton';

function TransactionOption(props: {
    transaction: Transaction;
    className?: string;
}) {
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
        overAmount,
    } = props.transaction;

    const dispatch = useDispatch();

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
                            overAmount,
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

    return <OptionButton className={props.className} menu={options} />;
}

export default TransactionOption;
