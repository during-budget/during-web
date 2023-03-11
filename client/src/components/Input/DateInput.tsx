import InputField from '../UI/InputField';

function DateInput(props: { id: string; className: string }) {
    return (
        <InputField id={`${props.id}-date-field`} className={props.className}>
            <input type="date" placeholder="날짜를 입력하세요" />
        </InputField>
    );
}

export default DateInput;
