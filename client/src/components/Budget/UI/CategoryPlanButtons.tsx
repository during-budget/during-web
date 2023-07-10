import { useDispatch } from 'react-redux';
import { uiActions } from '../../../store/ui';
import EditButton from '../../UI/EditButton';
import classes from './CategoryPlanButtons.module.css';

const CategoryPlanButtons = () => {
  const dispatch = useDispatch();

  // Handler for categoryPlan
  const openCategoryPlan = ({ isExpense }: { isExpense: boolean }) => {
    dispatch(
      uiActions.showCategoryPlanEditor({
        isExpense: isExpense,
        showEditPlan: true,
      })
    );
  };

  return (
    <>
      <div className={classes.buttons}>
        <EditButton
          onClick={() => {
            openCategoryPlan({ isExpense: true });
          }}
          label="지출 세부 목표 설정"
        />
        <EditButton
          onClick={() => {
            openCategoryPlan({ isExpense: false });
          }}
          label="수입 세부 목표 설정"
        />
      </div>
    </>
  );
};

export default CategoryPlanButtons;
