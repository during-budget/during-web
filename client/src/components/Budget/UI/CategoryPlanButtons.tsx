import { useDispatch } from 'react-redux';
import { uiActions } from '../../../store/ui';
import Button from '../../UI/Button';
import classes from './CategoryPlanButtons.module.css';

const CategoryPlanButtons = () => {
  const dispatch = useDispatch();

  // Handler for categoryPlan
  const openCategoryPlan = ({ isExpense }: { isExpense: boolean }) => {
    dispatch(
      uiActions.showCategoryPlanEditor({
        isExpense: isExpense,
        isEditPlan: true,
      })
    );
  };

  return (
    <div className={classes.buttons}>
      <Button
        styleClass="extra"
        onClick={() => {
          openCategoryPlan({ isExpense: true });
        }}
      >
        <span className={classes.edit}>지출 상세 목표 설정</span>
      </Button>
      <Button
        styleClass="extra"
        onClick={() => {
          openCategoryPlan({ isExpense: false });
        }}
      >
        <span className={classes.edit}>수입 상세 목표 설정</span>
      </Button>
    </div>
  );
};

export default CategoryPlanButtons;
