import InputField from '../../UI/InputField';

function NoteInput(props: { id: string; className: string }) {
    return (
        <InputField id={`${props.id}-note-field`} className={props.className}>
            <input type="text" placeholder="내용을 입력하세요" />
        </InputField>
    );
}

export default NoteInput;
