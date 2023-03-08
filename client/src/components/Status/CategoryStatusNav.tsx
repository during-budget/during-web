import Category from '../../models/Category';
import NavButton from '../UI/NavButton';
import classes from './CategoryStatusNav.module.css';

function CategoryStatusNav(props: {
    idx: number;
    setIdx: (param: any) => void;
    categories: Category[];
}) {
    const category = props.categories[props.idx];
    const lastIdx = props.categories.length - 1;

    const plusCategoryIdx = () => {
        props.setIdx((prevIdx: any) => {
            const nextIdx = prevIdx === lastIdx ? 0 : prevIdx + 1;
            return nextIdx;
        });
    };

    const minusCategoryIdx = () => {
        props.setIdx((prevIdx: any) => {
            const nextIdx = prevIdx === 0 ? lastIdx : prevIdx - 1;
            return nextIdx;
        });
    };

    return (
        <div className={classes.container}>
            <NavButton onClick={minusCategoryIdx} isNext={false} />
            <div>
                <span className={classes.icon}>{category.icon}</span>
                <span>{category.title}</span>
            </div>
            <NavButton onClick={plusCategoryIdx} isNext={true} />
        </div>
    );
}

export default CategoryStatusNav;
