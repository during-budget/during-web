import './App.css';
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from 'react-router-dom';
import Root from './layout/Root';
import Nav from './layout/Nav';
import ErrorBoundary from './layout/ErrorBoundary';
import BudgetNavigation, {
    loader as budgetListLoader,
} from './layout/BudgetNavigation';
import Auth, { loader as AuthLoader } from './screens/Auth';
import Budget, { loader as budgetLoader } from './screens/Budget';

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
                        loader: budgetListLoader,
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
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
