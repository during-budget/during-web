import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './App.css';
import CurrentBudgetNavigator, {
  loader as currentBudgetLoader,
} from './layout/CurrentBudgetNavigator';
import ErrorBoundary from './layout/ErrorBoundary';
import Nav from './layout/Nav';
import Root from './layout/Root';
import Asset from './screens/Asset';
import Auth, { loader as AuthLoader } from './screens/Auth';
import Budget, { loader as budgetLoader } from './screens/Budget';
import NewBudget from './screens/NewBudget';
import User from './screens/User';
import InitialSetting from './screens/InitialSetting';
import Redirect from './screens/Redirect';

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
        path: '/init',
        element: <Nav />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: '/init',
            element: <InitialSetting />,
          },
        ],
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
            path: '/budget/new',
            element: <NewBudget />,
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
      {
        path: '/redirect',
        element: <Redirect />,
        errorElement: <ErrorBoundary />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
