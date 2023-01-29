import { ScrollRestoration, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classes from './TransactionDetail.module.css';
import Amount from '../../models/Amount';
import RadioTab from '../../components/UI/RadioTab';

function TransactionDetail() {
    const navigation = useNavigate();
    const { budgetId, transactionId } = useParams();
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
                            navigation(`/budget/${budgetId}`);
                        }}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <div className={classes.header}>
                        <span className={classes.icon}>{transaction.icon}</span>
                        <h2>{transaction.title.join(' | ')}</h2>
                    </div>
                    <p className={classes.amount}>
                        {Amount.getAmountString(transaction.amount)}
                    </p>
                    <div className={classes.tabs}>
                        <RadioTab
                            name="transaction-detail-isCurrent"
                            values={[
                                {
                                    label: '예정 내역',
                                    value: 'false',
                                    defaultChecked: true,
                                    onClick: () => {},
                                },

                                {
                                    label: '거래 내역',
                                    value: 'true',
                                    onClick: () => {},
                                },
                            ]}
                        />
                        <span className={classes.divider}>|</span>
                        <RadioTab
                            name="transaction-detail-isExpense"
                            values={[
                                {
                                    label: '지출',
                                    value: 'true',
                                    defaultChecked: true,
                                    onClick: () => {},
                                },

                                {
                                    label: '수입',
                                    value: 'false',
                                    onClick: () => {},
                                },
                            ]}
                        />
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
