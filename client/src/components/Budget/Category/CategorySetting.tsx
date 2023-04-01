import { useSelector } from 'react-redux';
import classes from './CategorySetting.module.css';
import ConfirmCancelButtons from '../../UI/ConfirmCancelButtons';
import Overlay from '../../UI/Overlay';
import StatusHeader from '../Status/StatusHeader';
import { useEffect, useState } from 'react';
import Category from '../../../models/Category';
import CategorySettingItem from './CategorySettingItem';
import Button from '../../UI/Button';

function CategorySetting(props: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    handleChackedItems?: (checked: string[]) => void;
    isExpense?: boolean;
}) {
    const allCategories = useSelector((state: any) => state.category);

    const [categories, setCategories] = useState<Category[]>([]);
    const [isExpense, setIsExpense] = useState(
        props.isExpense === undefined ? true : props.isExpense
    );
    const [checkedCategoryIds, setCheckedCategoryIds] = useState<string[]>([]);

    useEffect(() => {
        const categories = allCategories.filter(
            (item: Category) => item.isExpense === isExpense
        );
        setCategories(categories);
    }, [allCategories, isExpense]);

    const checkedHandler = (checked: string) => {
        setCheckedCategoryIds((prev) => [...prev, checked]);
    };

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();

        props.handleChackedItems &&
            props.handleChackedItems(checkedCategoryIds);
    };

    const closeHandler = () => {
        props.setIsOpen(false);
    };

    return (
        <Overlay
            className={classes.container}
            isOpen={props.isOpen}
            isShowBackdrop={true}
            closeHandler={closeHandler}
        >
            <form onSubmit={submitHandler}>
                <StatusHeader id="category-setting" title="카테고리 설정" />
                <ul>
                    {categories.map((category, i) => (
                        <CategorySettingItem
                            key={i}
                            id={category.id}
                            icon={category.icon}
                            title={category.title}
                            onChecked={
                                props.handleChackedItems && checkedHandler
                            }
                        />
                    ))}
                </ul>
                <Button className={classes.add} styleClass="extra">
                    카테고리 추가
                </Button>
                <ConfirmCancelButtons
                    onClose={closeHandler}
                    confirmMsg="카테고리 설정 완료"
                />
            </form>
        </Overlay>
    );
}

export default CategorySetting;
