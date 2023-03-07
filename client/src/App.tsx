import './App.css';
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from 'react-router-dom';
import Root from './screens/Root';
import Auth, { loader as AuthLoader } from './screens/Auth';
import Nav from './screens/Nav';
import Budget, { loader as budgetLoader } from './screens/Budget';
import BudgetNavigation, {
    loader as budgetListLoader,
} from './screens/BudgetNavigation';

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
