import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';
import store from './store/index';
import Auth from './screens/auth/Auth';
import BudgetList from './screens/budget/BudgetList';
import BudgetForm from './screens/budget/BudgetForm';
import Budget from './screens/budget/Budget';
import TransactionDetail from './screens/budget/TransactionDetail';
import Test, { loader as testLoader } from './screens/Test';
import RequireAuth from './screens/auth/RequireAuth';
import Root from './screens/Root';
import ErrorBoundary from './screens/ErrorBoundary';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                path: '/',
                index: true,
                element: <Navigate to="/auth" />,
            },
            {
                path: '/auth',
                element: <Auth />,
            },
            {
                path: '/budget',
                element: (
                    <RequireAuth>
                        <Root />
                    </RequireAuth>
                ),
                children: [
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
                ],
            },
            {
                path: '/test',
                element: <Test />,
                loader: testLoader,
            },
        ],
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
