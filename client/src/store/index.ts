import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import budgetReducer from './budget';
import categoryReducer from './category';
import transactionReducer from './transaction';

const store = configureStore({
    reducer: {
        user: userReducer,
        budget: budgetReducer,
        category: categoryReducer,
        transaction: transactionReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
