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
import { RequestPayResponse } from '../../../types/portone';

const { DURING_STORE_CODE, DURING_CLIENT } = import.meta.env;

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
    const datetime = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, -3);
    window.IMP?.init(DURING_STORE_CODE);
    try {
      window.IMP?.request_pay(
        {
          pg: 'tosspayments',
          merchant_uid: `${datetime}-${userId}-${id}`,
          name: 'test',
          pay_method: 'card',
          amount: 2000,
          buyer_name: userName,
          buyer_email: email || '',
          currency: 'KRW',
          custom_data: { userId },
          m_redirect_url: `${DURING_CLIENT}/redirect/payment`,
        },
        (response) => {
          console.log(response);
          console.log(response.success);

          const {
            imp_uid: impUid,
            merchant_uid: merchantUid,
            success,
            error_code: errorCode,
            error_msg: errorMsg,
          } = response;

          if (success !== false) {
            // 결제 정보(impUid, merchantUid)를 서버에 전달해서 결제금액의 위변조 여부를 검증한 후 최종적으로 결제 성공 여부를 판단
            dispatch(
              uiActions.showModal({
                icon: '✓',
                title: '결제 성공',
                description: `${merchantUid}\n${impUid}`,
              })
            );
          } else {
            dispatch(
              uiActions.showModal({
                icon: '!',
                title: '결제 실패',
                description: '결제 시도 중 문제가 발생했습니다.',
              })
            );
            throw new Error(`결제오류: [${errorCode}] ${errorMsg}`);
          }
        }
      );
    } catch (error) {
      dispatch(
        uiActions.showErrorModal({ description: '결제 요청 중 문제가 발생했습니다.' })
      );
    }
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
                    paymentHandler(item.name);
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
