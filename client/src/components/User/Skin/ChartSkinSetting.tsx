import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/redux-hook';
import { settingActions } from '../../../store/setting';
import { uiActions } from '../../../store/ui';
import { updateChartSkin } from '../../../util/api/settingAPI';
import { ChartSkinType, SKIN_DATA } from '../../Budget/Amount/AmountRing';
import Button from '../../UI/Button';
import Mask from '../../UI/Mask';
import OverlayForm from '../../UI/OverlayForm';
import classes from './ChartSkinSetting.module.css';
import { SettingOverlayProps } from '../../../screens/User';

const ChartSkinSetting = ({ isOpen, onClose }: SettingOverlayProps) => {
  const skin = useAppSelector((state) => state.setting.data.chartSkin);
  const dispatch = useDispatch();

  const [skinState, setSkinState] = useState<ChartSkinType>(skin);

  const submitHandler = async () => {
    await updateChartSkin(skinState);
    dispatch(settingActions.setChartSkin(skinState));

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
                                mask={`/assets/svg/${skinState}_profile.svg`}
                              />
                            </div>
                          ),
                          itemId: skinState,
                          amount: 2000,
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
