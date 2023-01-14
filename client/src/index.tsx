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
import BudgetList from './screens/budget/BudgetList';
import BudgetForm from './screens/budget/BudgetForm';
import BudgetDetail from './screens/budget/BudgetDetail';
import TransactionDetail from './screens/budget/TransactionDetail';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/budget" replace />,
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
        element: <BudgetDetail />,
    },
    {
        path: '/budget/:budgetId/:transactionId',
        element: <TransactionDetail />,
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
