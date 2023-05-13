import { useAppDispatch } from '../../../hooks/redux-hook';
import Category from '../../../models/Category';
import { assetActions } from '../../../store/asset';
import { budgetActions } from '../../../store/budget';
import { budgetCategoryActions } from '../../../store/budget-category';
import { totalActions } from '../../../store/total';
import { transactionActions } from '../../../store/transaction';
import { uiActions } from '../../../store/ui';
import { TransactionType, deleteTransaction } from '../../../util/api/transactionAPI';
import OptionButton from '../../UI/OptionButton';

interface TransactionOptionProps {
  transaction: TransactionType;
  category: Category;
  onSelect?: () => void;
  onClick?: (event?: React.MouseEvent) => void;
  isDefaultBudget?: boolean;
  className?: string;
  contextStyle?: any;
}

function TransactionOption({
  transaction,
  category,
  onSelect,
  onClick,
  isDefaultBudget,
  className,
  contextStyle,
}: TransactionOptionProps) {
  const dispatch = useAppDispatch();

  const { _id, linkId, isCurrent } = transaction;

  const edit = (transaction.isCurrent || !transaction.linkId) && {
    name: '내역 수정',
    action: () => {
      dispatch(
        transactionActions.setForm({
          mode: { isExpand: true, isEdit: true },
          default: { ...transaction },
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
          category,
        })
      );
    },
  };

  const getDone = !isCurrent &&
    !isDefaultBudget &&
    !linkId && {
      name: '거래내역으로 등록',
      action: () => {
        dispatch(uiActions.setIsCurrent(true));
        dispatch(
          transactionActions.setForm({
            mode: { isExpand: true, isDone: true },
            default: {
              ...transaction,
              linkId: _id,
              isCurrent: true,
            },
          })
        );
      },
    };

  const remove = (isCurrent || !linkId) && {
    name: '내역 삭제',
    action: async () => {
      if (confirm('정말 삭제할까요?') === false) return;
      const { transactionLinked, budget, assets } = await deleteTransaction(_id);

      // remove transaction
      dispatch(transactionActions.removeTransaction(_id));
      dispatch(transactionActions.replaceTransactionFromData(transactionLinked));

      // dispatch updated amount
      dispatch(budgetActions.setCurrentBudget(budget));
      dispatch(totalActions.setTotalFromBudgetData(budget));
      dispatch(budgetCategoryActions.setCategoryFromData(budget.categories));
      dispatch(assetActions.setAssets(assets));
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
      onSelect={onSelect}
      className={className}
      contextStyle={contextStyle}
    />
  );
}

export default TransactionOption;
