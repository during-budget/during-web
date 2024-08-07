import { ChartSkinType, SKIN_DATA } from '../../../constants/chart-skin';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import useScreenEndPoint from '../../../hooks/useScreenEndPoint';
import Amount from '../../../models/Amount';
import { settingActions } from '../../../store/setting';
import { uiActions } from '../../../store/ui';
import { getOptions, updateChartSkin } from '../../../util/api/settingAPI';
import { getErrorMessage } from '../../../util/error';
import AmountRing from '../../Budget/Amount/AmountRing';
import Button from '../../UI/button/Button';
import Mask from '../../UI/component/Mask';
import classes from './ChartSkinSetting.module.css';

interface ChartSkinListProps {
  price?: number;
}

const ChartSkinList = ({ price }: ChartSkinListProps) => {
  const dispatch = useAppDispatch();

  const { selected: skinState, options } = useAppSelector(
    (state) => state.setting.chartSkin
  );

  const clickHandler = (isLocked: boolean, skin: ChartSkinType) => {
    if (isLocked) {
      payHandler(skin);
    } else {
      submitHandler(skin);
    }
  };

  const submitHandler = async (skin: ChartSkinType) => {
    try {
      await updateChartSkin(skin);
      dispatch(settingActions.updateSelectedOption({ field: 'chartSkin', value: skin }));
    } catch (error) {
      const message = getErrorMessage(error);

      if ((error as Error).message === 'PAYMENT_NOT_FOUND') {
        dispatch(
          uiActions.showModal({
            title: '구매하지 않은 상품입니다',
            description: '구매 후 이용해주세요.',
          })
        );
      } else if (message) {
        dispatch(
          uiActions.showModal({
            title: '문제가 발생했습니다',
            description: message,
          })
        );
      } else {
        dispatch(
          uiActions.showErrorModal({
            title: '문제가 발생했습니다',
            description: '차트 스킨 설정을 적용할 수 없습니다.',
          })
        );
        throw error;
      }
    }
  };

  // NOTE: Get dash for different font-size (match for rem)
  // get screensize
  const [isLargeScreen, isSmallScreen] = useScreenEndPoint();
  const dash = isSmallScreen ? 315 : isLargeScreen ? 475 : 425;

  const payHandler = async (skin: ChartSkinType) => {
    dispatch(
      uiActions.setPayment({
        content: (
          <div className={classes.center}>
            <AmountRing
              amount={new Amount(240, 50, 360)}
              size="12rem"
              r="35%"
              thickness="2rem"
              dash={dash}
              skinScale={0.87}
              preview={skin}
            />
            <h3>{SKIN_DATA[skin].name}</h3>
            <p className="text-md">
              해당 상품 구매 후 적용 시 차트가 위와 같이 표시됩니다.
            </p>
          </div>
        ),
        itemId: skin,
        amount: price || 1500,
        onComplete: async (chartSkin: ChartSkinType) => {
          try {
            await updateChartSkin(chartSkin);
            const { options } = await getOptions('chartSkin');
            dispatch(
              settingActions.updateSetting({
                chartSkin: {
                  selected: chartSkin,
                  options,
                },
              })
            );
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
                  title: '문제가 발생했습니다',
                  description: '차트 스킨 설정을 적용할 수 없습니다.',
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
    <>
      <ul className={classes.list}>
        {Object.values(SKIN_DATA).map(({ id }) => {
          const isLocked = !options.includes(id);
          return (
            id !== 'basic' && (
              <li
                key={id}
                className={`${isLocked && skinState !== id ? classes.lock : classes.unlock} ${
                  skinState === id ? classes.selected : ''
                }`}
                onClick={clickHandler.bind(null, isLocked, id)}
              >
                <div className={classes.icon}>
                  <Mask
                    className={classes.profile}
                    mask={`/assets/svg/${id}_profile.svg`}
                  />
                </div>
                <Button
                  styleClass={isLocked && skinState !== id ? 'primary' : 'gray'}
                  sizeClass="sm"
                  className={classes.buy}
                  onClick={clickHandler.bind(null, isLocked, id)}
                >
                  {isLocked && skinState !== id 
                    ? `₩${price?.toLocaleString() || '1,500'}`
                    : skinState === id
                    ? '설정중'
                    : '설정하기'}
                </Button>
              </li>
            )
          );
        })}
      </ul>
      <Button
        styleClass="extra"
        onClick={() => {
          dispatch(
            settingActions.updateSelectedOption({ field: 'chartSkin', value: 'basic' })
          );
          updateChartSkin('basic');
        }}
      >
        기본 모양으로 설정
      </Button>
    </>
  );
};

export default ChartSkinList;
