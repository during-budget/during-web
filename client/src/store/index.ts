import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from './budget';

const store = configureStore({
    reducer: { budget: budgetReducer },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
