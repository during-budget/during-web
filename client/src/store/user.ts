import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  info: {
    email: '',
    userName: '',
    defaultBudgetId: '',
    assets: '',
    cards: '',
    paymentMethods: '',
    chartSkin: 'basic',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state) {
      state.isAuth = true;
    },
    logout(state) {
      state = initialState;
    },
    setUserInfo(state, action) {
      state.info = { ...action.payload, chartSkin: 'basic' };
    },
    setChartSkin(state, action: PayloadAction<string>) {
      state.info.chartSkin = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
