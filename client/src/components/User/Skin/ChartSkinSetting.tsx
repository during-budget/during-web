import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/useRedux';
import { SettingOverlayProps } from '../../../screens/User';
import { settingActions } from '../../../store/setting';
import Button from '../../UI/button/Button';
import OverlayForm from '../../UI/overlay/OverlayForm';
import ChartSkinList from './ChartSkinList';
import classes from './ChartSkinSetting.module.css';

const ChartSkinSetting = ({ isOpen, onClose }: SettingOverlayProps) => {
  const { selected: skinState } = useAppSelector((state) => state.setting.chartSkin);
  const dispatch = useDispatch();

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
        onSubmit={async () => {
          onClose();
        }}
        overlayOptions={{
          id: 'chart-skin-setting',
          isOpen,
          onClose,
        }}
        confirmCancelOptions={{
          closeMsg: '닫기',
        }}
        className={classes.chartSkinSetting}
      >
        <h5>차트 캐릭터 설정</h5>
        <ChartSkinList />
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
