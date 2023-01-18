import { ScrollRestoration, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classes from './TransactionDetail.module.css';

function TransactionDetail() {
    const navigation = useNavigate();
    const { transactionId } = useParams();
    const transactions = useSelector((state: any) => state.transactions);
    const transaction = transactions.find(
        (item: any) => item.id === transactionId
    );

    return (
        <>
            <div className={classes.container}>
                <ScrollRestoration />
                <div className={`page ${classes.detail}`}>
                    <button
                        className={classes.back}
                        onClick={() => {
                            navigation(-1);
                        }}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <div className={classes.header}>
                        <span className={classes.icon}>{transaction.icon}</span>
                        <h2>{transaction.title.join(' | ')}</h2>
                    </div>
                    <p className={classes.amount}>
                        {transaction.amount.toLocaleString()}원
                    </p>
                    <div className={classes.tabs}>
                        <ul className="nav-tab">
                            <li>
                                <input
                                    id="transaction-detail-scheduled"
                                    type="radio"
                                    name="transaction-detail-isCurrent"
                                    defaultChecked={true}
                                ></input>
                                <label htmlFor="transaction-detail-scheduled">
                                    예정 내역
                                </label>
                            </li>
                            <li>
                                <input
                                    id="transaction-detail-current"
                                    type="radio"
                                    name="transaction-detail-isCurrent"
                                ></input>
                                <label htmlFor="transaction-detail-current">
                                    거래 내역
                                </label>
                            </li>
                        </ul>
                        <span className={classes.divider}>|</span>
                        <ul className="nav-tab">
                            <li>
                                <input
                                    id="transaction-detail-expense"
                                    type="radio"
                                    name="transaction-detail-isExpense"
                                    defaultChecked={true}
                                ></input>
                                <label htmlFor="transaction-detail-expense">
                                    지출
                                </label>
                            </li>
                            <li>
                                <input
                                    id="transaction-detail-income"
                                    type="radio"
                                    name="transaction-detail-isExpense"
                                ></input>
                                <label htmlFor="transaction-detail-income">
                                    수입
                                </label>
                            </li>
                        </ul>
                    </div>
                    <form className={classes.form}>
                        <div className="input-field">
                            <label>분류</label>
                            <input type="text"></input>
                        </div>
                        <div className="input-field">
                            <label>날짜</label>
                            <input type="date"></input>
                        </div>
                        <div className="input-field">
                            <label>메모</label>
                            <textarea></textarea>
                        </div>
                        <div className="input-field">
                            <label>태그</label>
                            <input></input>
                        </div>
                    </form>
                </div>
                <hr />
                <div>
                    <ul className={`nav-tab ${classes.nav}`}>
                        <li>
                            <input
                                id="transaction-detail-title1"
                                type="radio"
                                name="transaction-detail-list-tab"
                                defaultChecked={true}
                            ></input>
                            <label htmlFor="transaction-detail-titl1">
                                제목1
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default TransactionDetail;
