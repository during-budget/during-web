import { useSelector } from 'react-redux';
import classes from './BudgetCategorySetting.module.css';
import ConfirmCancelButtons from '../../UI/ConfirmCancelButtons';
import Overlay from '../../UI/Overlay';
import StatusHeader from '../Status/StatusHeader';
import { useEffect, useState } from 'react';
import Category from '../../../models/Category';
import CategorySettingItem from './CategorySettingItem';
import Button from '../../UI/Button';

function BudgetCategorySetting(props: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    setCheckedCategories?: (checked: Category[]) => void;
    checkedIds?: string[];
    isExpense?: boolean;
}) {
    const allCategories = useSelector((state: any) => state.category);

    const [categories, setCategories] = useState<Category[]>([]);
    const [checkedCategoryIds, setCheckedCategoryIds] = useState<
        Map<string, boolean>
    >(new Map());

    // Set categories
    useEffect(() => {
        // current categories
        const categories = allCategories.filter(
            (item: Category) => item.isExpense === props.isExpense
        );
        setCategories(categories);

        // checked categories
        setCheckedCategoryIds(
            new Map(
                categories.map((item: Category) => [
                    item.id,
                    props.checkedIds?.includes(item.id),
                ])
            )
        );
    }, [allCategories, props.isExpense]);

    // Set checked from setting items
    const setCheckedId = async (id: string, checked: boolean) => {
        await setCheckedCategoryIds((prev) => {
            const next = new Map(prev);

            next.set(id, checked);

            return next;
        });
        console.log(checkedCategoryIds);
    };

    // Handlers
    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();

        const checkedCategories: Category[] = [];

        checkedCategoryIds.forEach((value, key) => {
            if (value) {
                const category = allCategories.find(
                    (item: Category) => item.id === key
                );
                category && checkedCategories.push(category);
            }
        });

        props.setCheckedCategories &&
            props.setCheckedCategories(checkedCategories);
        props.setIsOpen(false);
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
                <ul className={classes.list}>
                    {categories.map((category, i) => (
                        <CategorySettingItem
                            key={i}
                            idx={i}
                            id={category.id}
                            icon={category.icon}
                            title={category.title}
                            isDefault={category.isDefault}
                            isChecked={checkedCategoryIds.get(category.id)}
                            setIsChecked={
                                props.setCheckedCategories && setCheckedId
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

export default BudgetCategorySetting;
