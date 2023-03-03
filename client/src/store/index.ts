import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import budgetReducer from './budget';

const store = configureStore({
    reducer: {
        user: userReducer,
        budgets: budgetReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
