import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
import Layout from './layout/Layout';
import PaymentRedirect from './layout/PaymentRedirect';
import Root, { loader as networkLoader } from './layout/Root';
import Budget, { loader as budgetLoader } from './screens/Budget';
import Landing, { loader as userLoader } from './screens/Landing';
import NewBudget from './screens/NewBudget';
import { uiActions } from './store/ui';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorBoundary />,
    loader: networkLoader,
    children: [
      {
        path: '/landing',
        element: <Landing />,
        action: userLoader,
      },
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            path: '/budget',
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

    // children: [
    //   {
    //     path: '/',
    //     index: true,
    //     element: <Landing />,
    //     loader: userLoader, // get user state
    //   },
    //   {
    //     path: '/init',
    //     element: <Root />,
    //     children: [
    //       {
    //         path: '/init',
    //         element: <InitialSetting />,
    //       },
    //     ],
    //   },
    //   {
    //     path: '/budget',
    //     element: <Root />,
    //     children: [
    //       {
    //         path: '/budget',
    //         element: <CurrentBudgetNavigator />,
    //         loader: currentBudgetLoader,
    //       },
    //       {
    //         path: '/budget/new',
    //         element: <NewBudget />,
    //       },
    //       {
    //         path: '/budget/:budgetId',
    //         element: <Budget />,
    //         loader: budgetLoader,
    //       },
    //       {
    //         path: '/budget/:isDefault/:budgetId',
    //         element: <Budget />,
    //         loader: budgetLoader,
    //       },
    //     ],
    //   },
    //   {
    //     path: '/category',
    //     element: <Nav />,
    //     children: [
    //       {
    //         path: '/category/:categoryId/:budgetId',
    //         element: <CategoryDetail />,
    //         loader: categoryLoader,
    //       },
    //     ],
    //   },
    //   {
    //     path: '/asset',
    //     element: <Nav />,
    //     children: [
    //       {
    //         path: '/asset',
    //         element: <Asset />,
    //       },
    //     ],
    //   },
    //   {
    //     path: '/store',
    //     element: <Nav />,
    //     children: [
    //       {
    //         path: '/store',
    //         element: <Store />,
    //       },
    //     ],
    //   },
    //   {
    //     path: '/user',
    //     element: <Nav />,
    //     children: [
    //       {
    //         path: '/user',
    //         element: <User />,
    //       },
    //     ],
    //   },
    //   {
    //     path: '/redirect',
    //     children: [
    //       {
    //         path: '/redirect/auth',
    //         element: <AuthRedirect />,
    //       },
    //       {
    //         path: '/redirect/payment',
    //         element: <PaymentRedirect />,
    //       },
    //     ],
    //   },
    // ],
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
