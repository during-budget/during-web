import RadioTab from '../../UI/RadioTab';

function TransactionNav(props: {
    id: string;
    isCurrent: boolean;
    isLine?: boolean;
    setIsCurrent: (isCurrent: boolean) => void;
}) {
    const tabs = [
        {
            label: '예정내역',
            value: 'scheduled',
            checked: !props.isCurrent,
            onChange: () => {
                props.setIsCurrent(false);
            },
        },
        {
            label: '거래내역',
            value: 'current',
            checked: props.isCurrent,
            onChange: () => {
                props.setIsCurrent(true);
            },
        },
    ];

    return <RadioTab name={props.id} values={tabs} isLine={props.isLine} />;
}

export default TransactionNav;
