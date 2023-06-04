import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/redux-hook';
import { SettingOverlayProps } from '../../../screens/User';
import { settingActions } from '../../../store/setting';
import { uiActions } from '../../../store/ui';
import { updateChartSkin } from '../../../util/api/settingAPI';
import { getErrorMessage } from '../../../util/error';
import { ChartSkinType, SKIN_DATA } from '../../Budget/Amount/AmountRing';
import Button from '../../UI/Button';
import Mask from '../../UI/Mask';
import OverlayForm from '../../UI/OverlayForm';
import classes from './ChartSkinSetting.module.css';

const ChartSkinSetting = ({ isOpen, onClose }: SettingOverlayProps) => {
  const skin = useAppSelector((state) => state.setting.data.chartSkin);
  const dispatch = useDispatch();

  const [skinState, setSkinState] = useState<ChartSkinType>(skin);

  const submitHandler = async () => {
    try {
      await updateChartSkin(skinState);
      dispatch(settingActions.setChartSkin(skinState));
    } catch (error) {
      const message = getErrorMessage(error);

      console.log(error, (error as Error).message, message);
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

  useEffect(() => {
    if (isOpen) {
      setSkinState(skin);
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
        className={classes.chartSkinSetting}
      >
        <h5>차트 캐릭터 설정</h5>
        <ul className={classes.list}>
          {Object.values(SKIN_DATA).map((item) => {
            return (
              item.name !== 'basic' && (
                <li
                  key={item.name}
                  className={`${skinState === item.name ? classes.selected : ''}`}
                  onClick={() => {
                    setSkinState(item.name);
                  }}
                >
                  <div className={classes.icon}>
                    <Mask
                      className={classes.profile}
                      mask={`/assets/svg/${item.name}_profile.svg`}
                    />
                  </div>
                  <Button
                    className={classes.buy}
                    onClick={() => {
                      setSkinState(item.name);
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
                              // TODO: 잠금표시 해제 및 선택 가능하도록 설정~? 서버 작업 후 처리하자
                              // await updateChartSkin(chartSkin);
                              // dispatch(settingActions.setChartSkin(chartSkin));
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
                    무료체험
                  </Button>
                </li>
              )
            );
          })}
        </ul>
        <Button
          styleClass="extra"
          onClick={() => {
            setSkinState('basic');
          }}
        >
          기본 모양으로 설정
        </Button>
      </OverlayForm>
    </>
  );
};

export default ChartSkinSetting;
