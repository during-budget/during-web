import Category from '../../models/Category';
import classes from './CategoryForm.module.css';
import OverlayForm from '../UI/form/OverlayForm';
import OptionButton from '../UI/OptionButton';
import RadioTab from '../UI/RadioTab';

function CategoryForm(props: {
    categories: Category[];
    onCancel: () => void;
    onSubmit?: () => void;
}) {
    return (
        <>
            <div className={classes.outside} onClick={props.onCancel}></div>
            <OverlayForm className={classes.form}>
                <h3>카테고리 설정</h3>
                <RadioTab
                    className={classes.tab}
                    name="category-form-type"
                    values={[
                        {
                            label: '지출',
                            value: 'expense',
                            defaultChecked: true,
                        },
                        {
                            label: '수입',
                            value: 'income',
                        },
                    ]}
                ></RadioTab>
                <ul className={classes.categories}>
                    {props.categories.map((category: Category) => {
                        return (
                            <li key={category.id} className={classes.category}>
                                <div className={classes.info}>
                                    <span className={classes.icon}>
                                        {category.icon}
                                    </span>
                                    <span className={classes.title}>
                                        {category.title}
                                    </span>
                                </div>
                                <div className={classes.settings}>
                                    <button className={classes.edit}>
                                        편집하기
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <button className={classes.new} type="button">
                    새 카테고리 추가
                </button>
                <div className={classes.buttons}>
                    <button
                        type="button"
                        className={classes.cancel}
                        onClick={props.onCancel}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className={`button__primary ${classes.submit}`}
                        onClick={props.onSubmit}
                    >
                        완료
                    </button>
                </div>
            </OverlayForm>
        </>
    );
}

export default CategoryForm;
