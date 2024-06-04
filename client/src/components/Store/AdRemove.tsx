import { useAppDispatch } from '../../hooks/useRedux';
import { uiActions } from '../../store/ui';
import { getErrorMessage } from '../../util/error';
import Button from '../UI/button/Button';
import classes from './AdRemove.module.css';

interface AddRemoveProps {
  price: number;
}

const AdRemove = ({ price }: AddRemoveProps) => {
  const dispatch = useAppDispatch();

  const payHandler = async (itemId: string) => {
    dispatch(
      uiActions.setPayment({
        content: (
          <div className={`${classes.adContainer} ${classes.detail}`}>
            <h4>🚫 광고 없애기 🚫</h4>
            <p>하단에 표시되는 광고를 제거합니다.</p>
          </div>
        ),
        itemId,
        amount: price || 4900,
        onComplete: undefined
      })
    );
  };

  return (
    <div className={`${classes.adContainer} ${classes.item}`}>
      <h4>🚫 광고 없애기 🚫</h4>
      <Button
        onClick={() => {
          payHandler('remove_ad');
        }}
      >
        {`₩${price?.toLocaleString() || '4,900'}`}
      </Button>
    </div>
  );
};

export default AdRemove;
