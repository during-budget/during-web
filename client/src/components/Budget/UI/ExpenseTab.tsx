import RadioTab from '../../UI/RadioTab';

function ExpenseTab(props: {
    id: string;
    isExpense: boolean;
    setIsExpense: (isExpense: boolean) => void;
    disabled?: boolean;
}) {
    const tabs = [
        {
            label: '지출',
            value: 'expense',
            checked: props.isExpense,
            onChange: () => {
                props.setIsExpense(true);
            },
            disabled: props.disabled,
        },
        {
            label: '수입',
            value: 'income',
            checked: !props.isExpense,
            onChange: () => {
                props.setIsExpense(false);
            },
            disabled: props.disabled,
        },
    ];

    return <RadioTab name={props.id} values={tabs} />;
}

export default ExpenseTab;
