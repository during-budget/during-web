import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/useRedux';
import { SettingOverlayProps } from '../../../screens/User';
import { settingActions } from '../../../store/setting';
import Button from '../../UI/button/Button';
import OverlayForm from '../../UI/overlay/OverlayForm';
import ChartSkinList from './ChartSkinList';
import classes from './ChartSkinSetting.module.css';
import { updateChartSkin } from '../../../util/api/settingAPI';

const ChartSkinSetting = ({ isOpen, onClose, className }: SettingOverlayProps) => {
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
        className={className}
      >
        <h5>차트 캐릭터 설정</h5>
        <ChartSkinList />
      </OverlayForm>
    </>
  );
};

export default ChartSkinSetting;
