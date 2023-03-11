import InputField from '../../UI/InputField';

function CategoryInput(props: { id: string; className: string }) {
    return (
        <InputField id={`${props.id}-category-field`} className={props.className}>
            <select>
                <option>카테고리 없음</option>
            </select>
        </InputField>
    );
}

export default CategoryInput;
