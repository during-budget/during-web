import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import basicReducer from './basic';
import budgetReducer from './budget';
import categoryReducer from './category';
import transactionReducer from './transaction';
import uiReducer from './ui';

const store = configureStore({
    reducer: {
        user: userReducer,
        basic: basicReducer,
        budget: budgetReducer,
        category: categoryReducer,
        transaction: transactionReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
