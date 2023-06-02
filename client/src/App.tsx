import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import CurrentBudgetNavigator, {
  loader as currentBudgetLoader,
} from './layout/CurrentBudgetNavigator';
import ErrorBoundary from './layout/ErrorBoundary';
import Nav from './layout/Nav';
import Root, { loader as networkLoader } from './layout/Root';
import Asset from './screens/Asset';
import Budget, { loader as budgetLoader } from './screens/Budget';
import InitialSetting from './screens/InitialSetting';
import Landing, { loader as userLoader } from './screens/Landing';
import NewBudget from './screens/NewBudget';
import User from './screens/User';
import PaymentRedirect from './layout/PaymentRedirect';
import AuthRedirect from './layout/AuthRedirect';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorBoundary />,
    loader: networkLoader,
    children: [
      {
        path: '/',
        index: true,
        element: <Landing />,
        loader: userLoader, // get user state
      },
      {
        path: '/init',
        element: <Nav />,
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
        children: [
          {
            path: '/user',
            element: <User />,
          },
        ],
      },
      {
        path: '/redirect',
        children: [
          {
            path: '/redirect',
            element: <AuthRedirect />,
          },
          {
            path: '/redirect/payment',
            element: <PaymentRedirect />,
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
