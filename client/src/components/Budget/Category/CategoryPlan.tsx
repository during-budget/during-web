import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../../../store/ui';
import CompleteCancelButtons from '../../UI/CompleteCancelButtons';
import Overlay from '../../UI/Overlay';
import StatusHeader from '../Status/StatusHeader';
import ExpenseTab from '../UI/ExpenseTab';

function CategoryPlan() {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: any) => state.ui.category.isOpen);

    const [isExpense, setIsExpense] = useState(true);

    const closeHandler = () => {
        dispatch(uiActions.showCategory(false));
    };

    return (
        <Overlay
            isOpen={isOpen}
            isShowBackdrop={true}
            closeHandler={closeHandler}
        >
            <StatusHeader
                id="category-plan-type"
                title="카테고리별 현황"
                tab={
                    <ExpenseTab
                        id="category-plan-type-tab"
                        isExpense={isExpense}
                        setIsExpense={setIsExpense}
                    />
                }
            />
            <CompleteCancelButtons onClose={closeHandler} />
        </Overlay>
    );
}

export default CategoryPlan;
