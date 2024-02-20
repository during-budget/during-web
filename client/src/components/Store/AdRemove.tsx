import { useAppDispatch } from '../../hooks/useRedux';
import { uiActions } from '../../store/ui';
import { getErrorMessage } from '../../util/error';
import Button from '../UI/button/Button';
import classes from './AdRemove.module.css';

interface AddRemoveProps {
  price?: number;
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
        amount: price || 6000,
        onComplete: async (itemId: string) => {
          try {
            // await updateChartSkin(chartSkin);
            // const { options } = await getOptions('chartSkin');
            // dispatch(
            //   settingActions.updateSetting({
            //     chartSkin: {
            //       selected: chartSkin,
            //       options,
            //     },
            //   })
            // );
          } catch (error) {
            const message = getErrorMessage(error);
            if (message) {
              dispatch(
                uiActions.showModal({
                  title: '문제가 발생했습니다',
                  description: message,
                })
              );
            } else {
              dispatch(
                uiActions.showErrorModal({
                  title: '광고 제거를 적용할 수 없습니다',
                  description: '사용자 설정의 문의 채널로 문의 바랍니다.',
                })
              );
              throw error;
            }
          }
        },
      })
    );
  };

  return (
    <div className={`${classes.adContainer} ${classes.item}`}>
      <h4>🚫 광고 없애기 🚫</h4>
      <Button
        onClick={() => {
          payHandler('ad');
        }}
      >
        {`₩${price?.toLocaleString() || '4,900'}`}
      </Button>
    </div>
  );
};

export default AdRemove;
