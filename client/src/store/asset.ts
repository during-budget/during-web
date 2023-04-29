import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AssetDataType, CardDataType, PaymentDataType } from '../util/api/assetAPI';

const initialState: {
  assets: AssetDataType[];
  cards: CardDataType[];
  paymentMethods: PaymentDataType[];
} = {
  assets: [],
  cards: [],
  paymentMethods: [],
};

const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    setAssets(
      state,
      action: PayloadAction<{
        assets: AssetDataType[];
        cards: CardDataType[];
        paymentMethods: PaymentDataType[];
      }>
    ) {
      const { assets, cards, paymentMethods } = action.payload;
      state.assets = assets;
      state.cards = cards;
      state.paymentMethods = paymentMethods;
    },
  },
});

export const assetActions = assetSlice.actions;
export default assetSlice.reducer;
