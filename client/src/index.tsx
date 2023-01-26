import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';
import store from './store/index';
import Auth from './screens/user/Auth';
import BudgetList from './screens/budget/BudgetList';
import BudgetForm from './screens/budget/BudgetForm';
import Budget from './screens/budget/Budget';
import TransactionDetail from './screens/budget/TransactionDetail';
import Test, { loader as testLoader } from './screens/Test';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/auth" replace />,
    },
    {
        path: '/auth',
        element: <Auth />
    },
    {
        path: '/budget',
        element: <BudgetList />,
    },
    {
        path: '/budget/form',
        element: <BudgetForm />,
    },
    {
        path: '/budget/:budgetId',
        element: <Budget />,
    },
    {
        path: '/budget/:budgetId/:transactionId',
        element: <TransactionDetail />,
    },
    {
        path: '/test',
        element: <Test />,
        loader: testLoader,
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
