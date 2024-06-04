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
import { useAppDispatch, useAppSelector } from './hooks/useRedux';
import AuthRedirect from './layout/AuthRedirect';
import CurrentBudgetNavigator, {
  loader as currentBudgetLoader,
} from './layout/CurrentBudgetNavigator';
import ErrorBoundary from './layout/ErrorBoundary';
import Index from './layout/Index';
import PaymentRedirect from './layout/PaymentRedirect';
import RequireAuth from './layout/RequireAuth';
import Root, { loader as userLoader } from './layout/Root';
import Asset from './screens/Asset';
import Budget, { loader as budgetLoader } from './screens/Budget';
import InitialSetting from './screens/InitialSetting';
import Landing from './screens/Landing';
import NewBudget from './screens/NewBudget';
import Store from './screens/Store';
import User, { action as userAction } from './screens/User';
import { uiActions } from './store/ui';
import { completeMobilePayment } from './util/api/paymentAPI';

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
  const { onComplete } = useAppSelector((state) => state.ui.payment);
  const purchasedItems = useAppSelector((state) => state.user.items);

  useEffect(() => {
    const filterRemoveAds = purchasedItems.filter(
      (items) => items.title === 'remove_ad'
    );

    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ intent: 'ad', content: !!filterRemoveAds.length })
    );
  }, [purchasedItems]);

  useEffect(() => {
    // event: Message Event
    const getWebviewMsg = async (event: any) => {
      try {
        const { intent, content } = JSON.parse(event.data);

        switch (intent) {
          case 'platform':
            if (content === 'android' || content === 'ios') {
              dispatch(uiActions.setPlatform(content));
            }
            break;
          case 'payment':
            await completeMobilePayment(content);
            onComplete && onComplete(content.id);
            dispatch(uiActions.closePayment());
            dispatch(
              uiActions.showModal({
                icon: '✓',
                title: '결제 성공',
                hideChannelButtonOnClose: true,
              })
            );
            break;
          case 'purchase_error':
            dispatch(uiActions.closePayment());
            dispatch(uiActions.showErrorModal({ icon: '!', title: '결제 실패' }));
        }
      } catch (e) {}
    };

    // android
    document.addEventListener('message', getWebviewMsg);
    // ios
    window.addEventListener('message', getWebviewMsg);
  }, [onComplete]);

  return <RouterProvider router={router} />;
}

export default App;
