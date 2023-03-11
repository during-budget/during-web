import InputField from '../../UI/InputField';

function AmountInput(props: {
    id: string;
    className?: string;
    onFocus?: (event: React.FocusEvent) => void;
    onClick?: (event: React.MouseEvent) => void;
}) {
    return (
        <InputField id={`${props.id}-amount-field`} className={props.className}>
            <input
                type="number"
                placeholder="금액을 입력하세요"
                onFocus={props.onFocus}
                onClick={props.onClick}
            />
        </InputField>
    );
}

export default AmountInput;
