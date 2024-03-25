import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  OptionFieldType,
  ValueFieldType,
  ValueType
} from '../util/api/settingAPI';

export type SettingType = ValueSettingType & OptionSettingType;

type ValueSettingType = {
  [field in ValueFieldType]: string;
};

type OptionSettingType = {
  [field in OptionFieldType]: OptionType;
};
interface OptionType {
  selected: ValueType;
  options: ValueType[];
}

const initialState: SettingType = {
  chartSkin: {
    selected: 'basic',
    options: [],
  },
  timeZone: 'Asia/Seoul',
};

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setSettings(state, action: PayloadAction<SettingType>) {
      const setting = action.payload;

      for (const field in setting) {
        // @ts-ignore
        state[field] = setting[field];
      }
    },
    updateSetting(state, action: PayloadAction<Partial<SettingType>>) {
      const setting = action.payload;

      for (const field in setting) {
        // @ts-ignore
        state[field] = setting[field];
      }
    },
    updateSelectedOption(
      state,
      action: PayloadAction<{ field: OptionFieldType; value: ValueType }>
    ) {
      const { field, value } = action.payload;
      state[field].selected = value;
    },
    updateOptionList(
      state,
      action: PayloadAction<{ field: OptionFieldType; options: ValueType[] }>
    ) {
      const { field, options } = action.payload;
      state[field].options = options;
    },
  },
});

export const settingActions = settingSlice.actions;
export default settingSlice.reducer;
