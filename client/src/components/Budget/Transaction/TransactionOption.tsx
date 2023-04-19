import { useAppDispatch } from '../../../hooks/redux-hook';
import Category from '../../../models/Category';
import Transaction from '../../../models/Transaction';
import { budgetCategoryActions } from '../../../store/budget-category';
import { totalActions } from '../../../store/total';
import { transactionActions } from '../../../store/transaction';
import { uiActions } from '../../../store/ui';
import { deleteTransaction } from '../../../util/api/transactionAPI';
import { getNumericHypenDateString } from '../../../util/date';
import { getCurrentKey } from '../../../util/key';
import OptionButton from '../../UI/OptionButton';

function TransactionOption(props: {
  transaction: Transaction;
  category: Category;
  onSelect?: () => void;
  onClick?: (event?: React.MouseEvent) => void;
  isDefault?: boolean;
  className?: string;
  contextStyle?: any;
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

  const dispatch = useAppDispatch();

  const edit = (isCurrent || !linkId) && {
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
  };

  const goTo = linkId && {
    name: isCurrent ? '이전 예정 내역 보기' : '완료된 거래 내역 보기',
    action: async () => {
      // scroll
      await dispatch(uiActions.setIsCurrent(!isCurrent));

      const target = document.getElementById(linkId);
      target?.scrollIntoView({ block: 'center', behavior: 'smooth' });

      dispatch(
        transactionActions.openLink({
          id: linkId,
          category: props.category,
        })
      );
    },
  };

  const getDone = !isCurrent &&
    !props.isDefault &&
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

      // get key
      const key = getCurrentKey(isCurrent);

      // update total
      dispatch(
        totalActions.updateTotalAmount({
          isExpense,
          [key]: -amount,
        })
      );

      // update category
      dispatch(
        budgetCategoryActions.updateCategoryAmount({
          categoryId,
          [key]: -amount,
        })
      );
    },
  };

  const options = [];

  getDone && options.push(getDone);
  goTo && options.push(goTo);
  edit && options.push(edit);
  remove && options.push(remove);

  return (
    <OptionButton
      menu={options}
      onSelect={props.onSelect}
      className={props.className}
      contextStyle={props.contextStyle}
    />
  );
}

export default TransactionOption;
