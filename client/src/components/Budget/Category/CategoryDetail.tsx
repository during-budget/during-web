import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { LoaderFunctionArgs, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Amount from '../../../models/Amount';
import { budgetCategoryActions } from '../../../store/budget-category';
import { transactionActions } from '../../../store/transaction';
import { getBudgetById, getBudgetByMonth } from '../../../util/api/budgetAPI';
import { UserCategoryType, getCategory } from '../../../util/api/categoryAPI';
import { getTransactions } from '../../../util/api/transactionAPI';
import Icon from '../../UI/Icon';
import IndexNav from '../../UI/nav/IndexNav';
import LoadingSpinner from '../../UI/LoadingSpinner';
import NavButton from '../../UI/button/NavButton';
import AmountDetail from '../Amount/AmountDetail';
import TransactionList from '../Transaction/TransactionList';
import classes from './CategoryDetail.module.css';

const CategoryDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    // NOTE: 오버레이를 닫아도 전체 페이지를 리로드하지 않도록 해시를 추가하여 해시 간의 이동으로 간주되도록 처리
    navigate(location.pathname + '#base', { replace: true });
  }, []);


  const [isLoading, setIsLoading] = useState(true);
  const data = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  if (!data) throw new Error('카테고리 상세 데이터를 불러올 수 없습니다.');

  const { category, budget: budgetData, transactions: transactionData } = data;

  const [budget, setBudget] = useState(budgetData);
  const [transactions, setTransactions] = useState(transactionData);
  const [date, setDate] = useState(dayjs());
  const [amount, setAmount] = useState(new Amount(0, 0, 0));

  const { _id: budgetId, categories } = budget;

  useEffect(() => {
    setIsLoading(false);
    const filteredTransactions = transactions.filter(
      (transaction) => transaction.category.categoryId === category._id
    );

    dispatch(transactionActions.setTransactions(filteredTransactions));
    dispatch(budgetCategoryActions.setCategoryFromData(categories));

    const budgetCategory = categories.find((item) => item.categoryId === category._id);

    setAmount(
      new Amount(
        budgetCategory?.amountCurrent || 0,
        budgetCategory?.amountScheduledRemain || 0,
        budgetCategory?.amountPlanned || 0
      )
    );
  }, [transactions]);

  useEffect(() => {
    const navigateBudget = async () => {
      const year = date.get('year');
      const month = date.get('month');

      const { budget: budgetData } = await getBudgetByMonth(year, month + 1);
      const { transactions: transactionData } = await getTransactions(budgetData._id);

      setBudget(budgetData);
      setTransactions(transactionData);
    };
    navigateBudget();
  }, [date]);

  return (
    <>
      {isLoading && <LoadingSpinner isFull={true} />}
      <main>
        <NavButton
          padding="2.5rem 3rem"
          className={classes.nav}
          to={`/budget/${budgetId}`}
        />
        <section className={classes.data}>
          <div className={classes.header}>
            <div className={classes.title}>
              <Icon size="3.75rem" fontSize="1.875rem">
                {category?.icon}
              </Icon>
              <h1>{category?.title}</h1>
            </div>
            {/* TODO: 카테고리 개별 수정/삭제 구현 */}
            {/* <OptionButton menu={[]} disabled={true} /> */}
          </div>
          {/* TODO: GroupedBar 차트... 만들기.. 월별로..? 나중에.... 지금은 힘들다.. */}
          <AmountDetail id="budget-amount-detail-by-category" amount={amount} />
          <IndexNav
            onNext={async () => {
              setIsLoading(true);
              setDate((prev) => {
                const next = prev.add(1, 'month');
                return next;
              });
            }}
            onPrev={async () => {
              setIsLoading(true);
              setDate((prev) => {
                const next = prev.add(-1, 'month');
                return next;
              });
            }}
            title={date.locale('ko').format('MMMM')}
          />
        </section>
        <hr />
        <section>
          <TransactionList />
        </section>
      </main>
    </>
  );
};
export default CategoryDetail;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { categoryId, budgetId } = params;
  if (!categoryId) throw new Error('카테고리 정보를 찾기 위해 카테고리 id가 필요합니다.');
  if (!budgetId)
    throw new Error('카테고리의 예산별 내역을 찾기 위해 예산 id가 필요합니다.');

  const { category: userCategory } = (await getCategory(categoryId)) as {
    category: UserCategoryType;
  };
  const { budget } = await getBudgetById(budgetId);
  const { transactions } = await getTransactions(budgetId);

  return {
    budget,
    category: userCategory,
    transactions,
  };
};
