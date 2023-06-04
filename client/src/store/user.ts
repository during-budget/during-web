import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthDataType, SnsIdType } from '../util/api/authAPI';

const initialState: {
  isAuth: boolean;
  auth: AuthDataType;
  info: {
    _id: string;
    defaultBudgetId: string;
    userName: string;
    email?: string;
    tel?: string;
    birth?: string;
    gender?: string;
  };
} = {
  isAuth: false,
  auth: {
    email: '',
    isLocal: false,
    snsId: {
      google: undefined,
      naver: undefined,
      kakao: undefined,
    },
    isGuest: false,
  },
  info: {
    _id: '',
    defaultBudgetId: '',
    userName: '',
    email: '',
    tel: '',
    birth: '',
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
      console.log(state.auth.isGuest);
    },
    setUserInfo(state, action) {
      state.info = { ...action.payload };
    },
    setAuthInfo(state, action: PayloadAction<AuthDataType>) {
      const authInfo = action.payload;
      state.auth = { ...action.payload };
      if (!authInfo.snsId) {
        state.auth = { ...state.auth, snsId: initialState.auth.snsId };
      }
    },
    setSnsId(state, action: PayloadAction<SnsIdType>) {
      state.auth.snsId = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
