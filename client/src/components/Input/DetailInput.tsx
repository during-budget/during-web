import InputField from '../UI/InputField';

function DetailInput(props: { id: string; className: string }) {
    return (
        <InputField id={`${props.id}-detail-field`} className={props.className}>
            <textarea rows={2} placeholder="상세 내용을 입력하세요" />
        </InputField>
    );
}

export default DetailInput;
