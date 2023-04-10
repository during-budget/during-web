import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import budgetReducer from './budget';
import categoryReducer from './category';
import transactionReducer from './transaction';
import uiReducer from './ui';

const store = configureStore({
    reducer: {
        user: userReducer,
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
