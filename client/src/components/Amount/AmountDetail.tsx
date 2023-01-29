import classes from './AmountDetail.module.css';
import { useDispatch } from 'react-redux';
import { useRef, useState } from 'react';
import { budgetActions } from '../../store/budget';
import Amount from '../../models/Amount';
import RadioTab from '../UI/RadioTab';

function AmountDetail(props: {
    budgetId: string;
    isExpense: boolean;
    amount: Amount;
}) {
    const { budgetId, isExpense, amount } = props;

    const dispatch = useDispatch();

    const [isTotal, setIsTotal] = useState(true);
    const [isEditPlan, setEditPlan] = useState(false);

    const plannedAmountRef = useRef<HTMLInputElement>(null);

    const clickTotalHandler = () => {
        setIsTotal(true);
    };

    const clickLeftHandler = () => {
        setIsTotal(false);
    };

    const editPlanHandler = () => {
        setEditPlan((prevState) => !prevState);
        if (isEditPlan) {
            let plannedAmount = +plannedAmountRef.current!.value;
            if (!isTotal) {
                plannedAmount =
                    amount.planned + (plannedAmount - amount.getLeftPlanned());
            }
            dispatch(
                budgetActions.updatePlannedAmount({
                    budgetId,
                    isExpense,
                    amount: plannedAmount,
                })
            );
        }
    };

    const plannedAmount = isEditPlan ? (
        <div className="input-field">
            <input
                ref={plannedAmountRef}
                type="number"
                defaultValue={
                    isTotal ? amount.planned : amount.getLeftPlanned()
                }
            ></input>
        </div>
    ) : (
        <span className={classes.amount}>
            {isTotal ? amount.getPlannedStr() : amount.getLeftPlannedStr()}
        </span>
    );

    return (
        <div className={classes.container}>
            <RadioTab
                name="amount-detail"
                values={[
                    {
                        label: '전체 금액',
                        value: 'total',
                        defaultChecked: true,
                        onClick: clickTotalHandler,
                    },
                    {
                        label: '남은 금액',
                        value: 'left',
                        onClick: clickLeftHandler,
                    },
                ]}
            />
            <ul className={classes.info}>
                <li className={classes.scheduled}>
                    <span className={classes.label}>
                        {isTotal ? '예정 금액' : '남은 예정'}
                    </span>
                    <span className={classes.amount}>
                        {isTotal
                            ? amount.getScheduledStr()
                            : amount.getLeftScheduledStr()}
                    </span>
                </li>
                <li className={classes.current}>
                    <span className={classes.label}>현재 금액</span>
                    <span className={classes.amount}>
                        {amount.getCurrentStr()}
                    </span>
                </li>
                <li className={classes.budget}>
                    <span className={classes.label}>
                        {isTotal ? '목표 금액' : '남은 목표'}
                    </span>
                    {plannedAmount}
                    <button
                        type="button"
                        className={classes.edit}
                        onClick={editPlanHandler}
                    >
                        <i
                            className={`fa-solid ${
                                isEditPlan ? 'fa-check' : 'fa-pencil'
                            }`}
                        ></i>
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default AmountDetail;
