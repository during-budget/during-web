import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from './budget';
import categoryReducer from './category';
import transactionReducer from './transaction';
import uiReducer from './ui';
import userReducer from './user';

const store = configureStore({
    reducer: {
        user: userReducer,
        budgets: budgetReducer,
        categories: categoryReducer,
        transactions: transactionReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
