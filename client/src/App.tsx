import { useEffect } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { action as emailAction } from './components/Auth/EmailForm';
import CategoryDetail, {
  loader as categoryLoader,
} from './components/Budget/Category/CategoryDetail';
import './css/_reset.css';
import './css/color.css';
import './css/layout.css';
import './css/text.css';
import { useAppDispatch } from './hooks/useRedux';
import AuthRedirect from './layout/AuthRedirect';
import CurrentBudgetNavigator, {
  loader as currentBudgetLoader,
} from './layout/CurrentBudgetNavigator';
import ErrorBoundary from './layout/ErrorBoundary';
import Index from './layout/Index';
import PaymentRedirect from './layout/PaymentRedirect';
import Root, { loader as userLoader } from './layout/Root';
import Asset from './screens/Asset';
import Budget, { loader as budgetLoader } from './screens/Budget';
import InitialSetting from './screens/InitialSetting';
import Landing from './screens/Landing';
import NewBudget from './screens/NewBudget';
import Store from './screens/Store';
import User, { action as userAction } from './screens/User';
import { uiActions } from './store/ui';
import RequireAuth from './layout/RequireAuth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/landing',
        element: (
          <RequireAuth noRequired={true}>
            <Landing />
          </RequireAuth>
        ),
        loader: userLoader,
        action: emailAction,
      },
      {
        path: '/',
        element: (
          <RequireAuth>
            <Index />
          </RequireAuth>
        ),
        loader: userLoader,
        children: [
          {
            path: '/',
            element: <Navigate to="/budget" />,
          },
          {
            path: '/budget',
            children: [
              {
                path: '/budget',
                element: <CurrentBudgetNavigator />,
                loader: currentBudgetLoader,
              },
              {
                path: '/budget/init',
                element: <InitialSetting />,
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
            path: '/category/:categoryId/:budgetId',
            element: <CategoryDetail />,
            loader: categoryLoader,
          },
          {
            path: '/asset',
            element: <Asset />,
          },
          {
            path: '/store',
            element: <Store />,
          },
          {
            path: '/user',
            element: <User />,
            action: userAction,
          },
        ],
      },
      {
        path: '/redirect',
        children: [
          {
            path: '/redirect/auth',
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    // event: Message Event
    const setPlatform = (event: any) => {
      try {
        const { platform } = JSON.parse(event.data);

        if (platform === 'android' || platform === 'ios') {
          dispatch(uiActions.setPlatform(platform));
        }
      } catch (e) {}
    };

    // android
    document.addEventListener('message', setPlatform);
    // ios
    window.addEventListener('message', setPlatform);
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
