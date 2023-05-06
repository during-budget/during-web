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
import * as Sentry from '@sentry/react';

if (import.meta.env.MODE === 'production') {
  Sentry.init({
    dsn: 'https://7447449226b942609c7f55f66d10d401@o4505136726605824.ingest.sentry.io/4505136729227264',
    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

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
        element: <InitialSetting />,
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
