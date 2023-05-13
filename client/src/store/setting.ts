import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ChartSkinType } from '../components/Budget/Amount/AmountRing';
import { SettingType } from '../util/api/settingAPI';

const initialState: { data: SettingType } = {
  data: {
    chartSkin: 'basic',
  },
};

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setSettings(state, action: PayloadAction<SettingType>) {
      // TODO: 제대로 업데이트 반영하는지 테스트 필요...
      state.data = action.payload;
    },
    setChartSkin(state, action: PayloadAction<ChartSkinType>) {
      state.data.chartSkin = action.payload;
    },
  },
});

export const settingActions = settingSlice.actions;
export default settingSlice.reducer;
