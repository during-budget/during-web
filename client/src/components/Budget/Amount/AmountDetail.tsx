import { useState } from 'react';
import classes from './AmountDetail.module.css';
import Amount from '../../../models/Amount';
import RadioTab from '../../UI/RadioTab';
import AmountDetailItem from './AmountDetailItem';

function AmountDetail(props: {
    id: string;
    amount: Amount;
    editPlanHandler?: (amount: number) => void;
}) {
    const [isLeft, setIsLeft] = useState(false);

    const amount = props.amount;

    const tabs = [
        {
            label: '전체 금액',
            value: 'total',
            checked: !isLeft,
            onChange: () => {
                setIsLeft(false);
            },
        },
        {
            label: '남은 금액',
            value: 'left`',
            checked: isLeft,
            onChange: () => {
                setIsLeft(true);
            },
        },
    ];

    const details = [
        {
            label: isLeft ? '남은 예정' : '예정 금액',
            amountStr: amount.getScheduledStr(isLeft),
            labelColor: 'var(--secondary)',
            fontColor: 'var(--gray-3)',
            fontSize: 'var(--size-5)',
        },
        {
            label: '현재 금액',
            amountStr: amount.getCurrentStr(),
            labelColor: 'var(--primary)',
            fontColor: 'var(--gray-4)',
            fontSize: 'var(--size-3)',
        },
        {
            label: isLeft ? '남은 목표' : '목표 금액',
            amountStr: amount.getPlannedStr(isLeft),
            labelColor: 'var(--gray-1)',
            fontColor: 'var(--gray-2)',
            fontSize: 'var(--size-5)',
            editHandler: props.editPlanHandler,
        },
    ];

    return (
        <div className={classes.container}>
            <RadioTab
                name={`${props.id}-amount-detail`}
                values={tabs}
                isBold={false}
            />
            <ul>
                {details.map((data, i) => (
                    <AmountDetailItem
                        key={i}
                        labelColor={data.labelColor}
                        fontColor={data.fontColor}
                        fontSize={data.fontSize}
                        label={data.label}
                        amountStr={data.amountStr}
                        editHandler={data.editHandler}
                    />
                ))}
            </ul>
        </div>
    );
}

export default AmountDetail;
