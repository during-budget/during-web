import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/redux-hook';
import { settingActions } from '../../../store/setting';
import { updateChartSkin } from '../../../util/api/settingAPI';
import { ChartSkinType, SKIN_DATA } from '../../Budget/Amount/AmountRing';
import Button from '../../UI/Button';
import ConfirmCancelButtons from '../../UI/ConfirmCancelButtons';
import Mask from '../../UI/Mask';
import Overlay from '../../UI/Overlay';
import classes from './ChartSkinSetting.module.css';

interface ChartSkinSettingProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChartSkinSetting = ({ isOpen, setIsOpen }: ChartSkinSettingProps) => {
  const skin = useAppSelector((state) => state.setting.data.chartSkin);
  const dispatch = useDispatch();

  const [skinState, setSkinState] = useState<ChartSkinType>(skin);

  const submitHandler = (event: React.FormEvent) => {
    event?.preventDefault();

    dispatch(settingActions.setChartSkin(skinState));
    updateChartSkin(skinState);

    closeSetting();
  };

  const closeSetting = () => {
    setIsOpen(false);
  };

  return (
    <Overlay
      isOpen={isOpen}
      onClose={closeSetting}
      className={classes.chartSkinSetting}
    >
      <form className={classes.form} onSubmit={submitHandler}>
        <h5>차트 캐릭터 설정</h5>
        <ul className={classes.list}>
          {Object.values(SKIN_DATA).map((item) => {
            return (
              item.path !== 'basic' && (
                <li
                  key={item.path}
                  className={`${classes.option} ${
                    skinState === item.path ? classes.selected : ''
                  }`}
                  onClick={() => {
                    setSkinState(item.path);
                  }}
                >
                  <Mask
                    className={classes.profile}
                    mask={`/assets/svg/${item.path}_profile.svg`}
                  />
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
        <ConfirmCancelButtons isClose={!isOpen} onClose={closeSetting} />
      </form>
    </Overlay>
  );
};

export default ChartSkinSetting;
