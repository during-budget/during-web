import InputField from '../UI/InputField';

function TagInput(props: { id: string; className: string }) {
    return (
        <InputField id={`${props.id}-tag-field`} className={props.className}>
            <input type="text" placeholder="내용을 입력하세요" />
        </InputField>
    );
}

export default TagInput;
