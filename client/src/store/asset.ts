import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AssetDataType, CardDataType, PaymentDataType } from '../util/api/assetAPI';

interface AssetSliceType {
  assets: AssetDataType[];
  cards: CardDataType[];
  paymentMethods: PaymentDataType[];
}

const initialState: AssetSliceType = {
  assets: [],
  cards: [],
  paymentMethods: [],
};

const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    setAssets(state, action: PayloadAction<{ assets: AssetDataType[] }>) {
      const { assets } = action.payload;
      state.assets = assets;
    },
    setCards(state, action: PayloadAction<{ cards: CardDataType[] }>) {
      const { cards } = action.payload;
      state.cards = cards;
    },
    setPaymentMethods(
      state,
      action: PayloadAction<{ paymentMethods: PaymentDataType[] }>
    ) {
      const { paymentMethods } = action.payload;
      state.paymentMethods = paymentMethods;
    },
  },
});

export const assetActions = assetSlice.actions;
export default assetSlice.reducer;
