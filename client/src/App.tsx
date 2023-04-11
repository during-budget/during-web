import './App.css';
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from 'react-router-dom';
import Root from './layout/Root';
import Nav from './layout/Nav';
import ErrorBoundary from './layout/ErrorBoundary';
import BudgetNavigation from './layout/BudgetNavigation';
import Auth, { loader as AuthLoader } from './screens/Auth';
import Budget, { loader as budgetLoader } from './screens/Budget';
import User from './screens/User';
import DefaultBudget from './components/User/Default/DefaultBudget';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/',
                index: true,
                element: <Navigate to="/auth" />,
            },
            {
                path: '/auth',
                element: <Auth />,
                loader: AuthLoader,
            },
            {
                path: '/budget',
                element: <Nav />,
                errorElement: <ErrorBoundary />,
                children: [
                    {
                        path: '/budget',
                        element: <BudgetNavigation />,
                    },
                    {
                        path: '/budget/:budgetId',
                        element: <Budget />,
                        loader: budgetLoader,
                    },
                ],
            },
            {
                path: '/during',
                element: <Nav />,
            },
            {
                path: '/user',
                element: <Nav />,
                children: [
                    {
                        path: '/user',
                        element: <User />,
                    },
                    {
                        path: '/user/default/:budgetId',
                        element: <DefaultBudget />,
                        loader: budgetLoader,
                    },
                ],
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
