import InputField from '../../UI/InputField';

function PaymentInput(props: { id: string; className: string }) {
    return (
        <InputField
            id={`${props.id}-payment-field`}
            className={props.className}
        >
            <select>
                <option>결제수단 없음</option>
            </select>
        </InputField>
    );
}

export default PaymentInput;
