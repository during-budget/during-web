import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from './budget';
import categoryReducer from './category';
import transactionReducer from './transaction';
import uiReducer from './ui';

const store = configureStore({
    reducer: {
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
