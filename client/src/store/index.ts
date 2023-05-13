import { configureStore } from '@reduxjs/toolkit';
import assetReducer from './asset';
import budgetReducer from './budget';
import budgetCategoryReducer from './budget-category';
import settingReducer from './setting';
import totalCategoryReducer from './total';
import transactionReducer from './transaction';
import uiReducer from './ui';
import userReducer from './user';
import userCategoryReducer from './user-category';

const store = configureStore({
  reducer: {
    user: userReducer,
    userCategory: userCategoryReducer,
    budget: budgetReducer,
    total: totalCategoryReducer,
    budgetCategory: budgetCategoryReducer,
    transaction: transactionReducer,
    asset: assetReducer,
    setting: settingReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
