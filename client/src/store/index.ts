import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from './budget';
import transactionReducer from './transaction';

const store = configureStore({
    reducer: {
        budgets: budgetReducer,
        transactions: transactionReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
