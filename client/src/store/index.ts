import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from './budget';
import budgetCategoryReducer from './budget-category';
import transactionReducer from './transaction';
import uiReducer from './ui';
import userReducer from './user';
import userCategoryReducer from './user-category';
import totalCategoryReducer from './total';

const store = configureStore({
  reducer: {
    user: userReducer,
    userCategory: userCategoryReducer,
    budget: budgetReducer,
    total: totalCategoryReducer,
    budgetCategory: budgetCategoryReducer,
    transaction: transactionReducer,
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
