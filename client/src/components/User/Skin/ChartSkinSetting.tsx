import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/redux-hook';
import { settingActions } from '../../../store/setting';
import { updateChartSkin } from '../../../util/api/settingAPI';
import { ChartSkinType, SKIN_DATA } from '../../Budget/Amount/AmountRing';
import Button from '../../UI/Button';
import Mask from '../../UI/Mask';
import OverlayForm from '../../UI/OverlayForm';
import classes from './ChartSkinSetting.module.css';

const { DURING_STORE_ID } = import.meta.env;

interface ChartSkinSettingProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChartSkinSetting = ({ isOpen, setIsOpen }: ChartSkinSettingProps) => {
  const skin = useAppSelector((state) => state.setting.data.chartSkin);
  const { _id: userId, email, userName } = useAppSelector((state) => state.user.info);
  const dispatch = useDispatch();

  const [skinState, setSkinState] = useState<ChartSkinType>(skin);

  const submitHandler = async () => {
    await updateChartSkin(skinState);
    dispatch(settingActions.setChartSkin(skinState));

    closeSetting();
  };

  const paymentHandler = async (id: string) => {
    window.IMP?.init(DURING_STORE_ID);
    window.IMP?.request_pay(
      {
        pg: 'tosspayments',
        merchant_uid: 'chart_skin_' + id,
        name: '뾰족귀링차트',
        pay_method: 'card',
        amount: 2000,
        buyer_name: userName,
        buyer_email: email,
        buyer_tel: '010-6774-8109',
        currency: 'KRW',
        custom_data: { userId },
      },
      (response) => {
        console.log(response);
        if (response.success) {
          alert('결제 완료~');
        }
        // PC 환경에서 결제 프로세스 완료 후 실행 될 로직
      }
    );
  };
  const closeSetting = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      setSkinState(skin);
    }
  }, [isOpen]);

  return (
    <OverlayForm
      onSubmit={submitHandler}
      overlayOptions={{
        isOpen,
        onClose: closeSetting,
      }}
      formHeight="45vh"
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
                    console.log(item.name);
                    setSkinState(item.name);
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
  );
};

export default ChartSkinSetting;
