import './App.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Root from './layout/Root';
import Nav from './layout/Nav';
import ErrorBoundary from './layout/ErrorBoundary';
import CurrentBudgetNavigator, {
  loader as currentBudgetLoader,
} from './layout/CurrentBudgetNavigator';
import Auth, { loader as AuthLoader } from './screens/Auth';
import Budget, { loader as budgetLoader } from './screens/Budget';
import User from './screens/User';
import Asset from './screens/Asset';

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
            element: <CurrentBudgetNavigator />,
            loader: currentBudgetLoader,
          },
          {
            path: '/budget/:budgetId',
            element: <Budget />,
            loader: budgetLoader,
          },
          {
            path: '/budget/:isDefault/:budgetId',
            element: <Budget />,
            loader: budgetLoader,
          },
        ],
      },
      {
        path: '/asset',
        element: <Nav />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: '/asset',
            element: <Asset />,
          },
        ],
      },
      {
        path: '/user',
        element: <Nav />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: '/user',
            element: <User />,
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
