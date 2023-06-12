import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ChartSkinType, SKIN_DATA } from '../../../constants/chart-skin';
import { useAppSelector } from '../../../hooks/redux-hook';
import { SettingOverlayProps } from '../../../screens/User';
import { settingActions } from '../../../store/setting';
import { uiActions } from '../../../store/ui';
import { getOptions, updateChartSkin } from '../../../util/api/settingAPI';
import { getErrorMessage } from '../../../util/error';
import Button from '../../UI/Button';
import Mask from '../../UI/Mask';
import OverlayForm from '../../UI/OverlayForm';
import classes from './ChartSkinSetting.module.css';

const ChartSkinSetting = ({ isOpen, onClose }: SettingOverlayProps) => {
  const { selected: skinState, options } = useAppSelector(
    (state) => state.setting.chartSkin
  );
  const dispatch = useDispatch();

  const submitHandler = async () => {
    try {
      await updateChartSkin(skinState);
      dispatch(
        settingActions.updateSelectedOption({ field: 'chartSkin', value: skinState })
      );
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

    onClose();
  };

  // TODO: 필요한?지 체크
  useEffect(() => {
    if (isOpen) {
      dispatch(
        settingActions.updateSelectedOption({ field: 'chartSkin', value: skinState })
      );
    }
  }, [isOpen]);

  return (
    <>
      <OverlayForm
        onSubmit={submitHandler}
        overlayOptions={{
          isOpen,
          onClose,
        }}
        confirmCancelOptions={{
          closeMsg: '닫기'
        }}
        className={classes.chartSkinSetting}
      >
        <h5>차트 캐릭터 설정</h5>
        <ul className={classes.list}>
          {Object.values(SKIN_DATA).map((item) => {
            const isLocked = !options.includes(item.name);
            return (
              item.name !== 'basic' && (
                <li
                  key={item.name}
                  className={`${isLocked ? classes.lock : classes.unlock} ${
                    skinState === item.name ? classes.selected : ''
                  }`}
                  onClick={() => {
                    if (isLocked) {
                      return;
                    }

                    dispatch(
                      settingActions.updateSelectedOption({
                        field: 'chartSkin',
                        value: item.name,
                      })
                    );
                  }}
                >
                  <div className={classes.icon}>
                    <Mask
                      className={classes.profile}
                      mask={`/assets/svg/${item.name}_profile.svg`}
                    />
                  </div>
                  <Button
                    styleClass={isLocked ? 'primary' : 'gray'}
                    className={classes.buy}
                    onClick={() => {
                      if (!isLocked) {
                        settingActions.updateSelectedOption({
                          field: 'chartSkin',
                          value: item.name,
                        });
                        return;
                      }

                      dispatch(
                        uiActions.setPayment({
                          content: (
                            <div className={`${classes.icon} ${classes.selected}`}>
                              <Mask
                                className={classes.profile}
                                mask={`/assets/svg/${item.name}_profile.svg`}
                              />
                            </div>
                          ),
                          itemId: item.name,
                          amount: 2000,
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
                    }}
                  >
                    {isLocked ? '₩2000' : skinState === item.name ? '설정중' : '설정하기'}
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
          }}
        >
          기본 모양으로 설정
        </Button>
      </OverlayForm>
    </>
  );
};

export default ChartSkinSetting;
