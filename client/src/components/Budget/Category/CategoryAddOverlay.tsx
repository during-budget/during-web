import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { uiActions } from '../../../store/ui';
import { userCategoryActions } from '../../../store/user-category';
import { createCategory } from '../../../util/api/categoryAPI';
import EmojiInput from '../../UI/EmojiInput';
import OverlayForm from '../../UI/overlay/OverlayForm';
import classes from './CategoryAddOverlay.module.css';

const CategoryAddOverlay = () => {
  const dispatch = useAppDispatch();

  const { isOpen, isExpense } = useAppSelector((state) => state.ui.category.add);

  const iconRef = useRef<any>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const submitHandler = async () => {
    const icon = iconRef.current?.value() || (isExpense ? '💸' : '💵');
    const title = titleRef.current?.value || '';

    const { category } = await createCategory({ title, icon, isExpense });
    dispatch(userCategoryActions.addCategory(category));

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(uiActions.closeCategoryAdd());
  };

  useEffect(() => {
    if (isOpen) {
      iconRef.current?.clear();
    }
  }, [isOpen]);

  return (
    <OverlayForm
      overlayOptions={{
        id: 'category-add-overlay',
        isOpen,
        onClose: closeHandler,
      }}
      onSubmit={submitHandler}
    >
      <div className={classes.content}>
        <h5 className={classes.type}>{isExpense ? '지출 ' : '수입 '}카테고리 추가</h5>
        <div className={classes.data}>
          <EmojiInput
            ref={iconRef}
            placeholder={isExpense ? '💸' : '💵'}
            style={{
              width: '5rem',
              height: '5rem',
              fontSize: '2.5rem',
              borderRadius: '0.75rem',
            }}
          />
          <div className={classes.fields}>
            <input
              ref={titleRef}
              className={classes.title}
              placeholder="이름을 입력하세요"
            />
          </div>
        </div>
      </div>
    </OverlayForm>
  );
};

export default CategoryAddOverlay;
