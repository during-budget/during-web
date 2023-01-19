import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from './budget';
import categoryReducer from './category';
import transactionReducer from './transaction';

const store = configureStore({
    reducer: {
        budgets: budgetReducer,
        categories: categoryReducer,
        transactions: transactionReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
