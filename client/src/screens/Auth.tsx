import { useEffect, useState } from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router';
import EmailForm from '../components/Auth/EmailForm';
import SNSForm from '../components/Auth/SNSForm';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Modal from '../components/UI/Modal';
import Overlay from '../components/UI/Overlay';
import { useAppDispatch } from '../hooks/redux-hook';
import { assetActions } from '../store/asset';
import { budgetActions } from '../store/budget';
import { settingActions } from '../store/setting';
import { uiActions } from '../store/ui';
import { userActions } from '../store/user';
import { userCategoryActions } from '../store/user-category';
import { getBudgetById, getBudgetList } from '../util/api/budgetAPI';
import { UserDataType, getUserState } from '../util/api/userAPI';
import classes from './Auth.module.css';
import { useSearchParams } from 'react-router-dom';

function Auth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isEmailAuth, setIsEmailAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Get social login message
  const [params] = useSearchParams();
  const snsLoginMsg = params.get('message');

  useEffect(() => {
    switch (snsLoginMsg) {
      case 'LOGIN_SUCCESS':
      case 'REGISTER_SUCCESS':
        navigate('/budget');
        break;
      case 'REGISTER_FAILED_EMAIL_IN_USE':
        dispatch(
          uiActions.showModal({
            title: '이미 사용 중인 이메일입니다.',
            description: '이메일로 로그인 후 소셜 계정 연결을 진행해주세요.',
          })
        );
        break;
      // case 'CONNECT_FAILED_ALREADY_CONNECTED':
      //   dispatch(
      //     uiActions.showModal({
      //       title: '이미 연결된 소셜 계정입니다.',
      //     })
      //   );
      //   break;
      // case 'CONNECT_FAILED_SNSID_IN_USE':
      //   dispatch(
      //     uiActions.showModal({
      //       title: '다른 계정에서 사용 중인 소셜 계정입니다.',
      //     })
      //   );
      //   break;
      // case 'CONNECT_SUCCESS':
      //   break;
      case 'AUTH_FAILED_UNKNOWN_ERROR':
        dispatch(
          uiActions.showModal({
            title: '문제가 발생했습니다.',
            description: '잠시 후 다시 시도해주세요.',
            actionMsg: '제보하기',
            actionPrefix: '문제가 계속되나요? ',
          })
        );
        break;
      case 'INVALIED_REQUEST':
        dispatch(
          uiActions.showModal({
            title: '잘못된 요청입니다',
            description: '다시 시도해주세요.',
            actionMsg: '제보하기',
            actionPrefix: '문제가 계속되나요? ',
          })
        );
        break;
    }
  }, [snsLoginMsg]);

  // Get login
  const location = useLocation();
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (loaderData && 'user' in loaderData) {
      getUserLogin(loaderData.user);
    } else {
      setIsFirstLoad(false);
    }
  }, [loaderData]);

  const getUserLogin = async (user: UserDataType) => {
    // get user data
    const {
      userName,
      email,
      basicBudgetId: defaultBudgetId,
      categories,
      assets,
      cards,
      paymentMethods,
      settings,
    } = user;

    // set user data
    dispatch(userActions.login());
    dispatch(
      userActions.setUserInfo({
        userName,
        email,
        defaultBudgetId,
        settings,
      })
    );
    dispatch(userCategoryActions.setCategories(categories));
    dispatch(assetActions.setAssets(assets));
    dispatch(assetActions.setCards(cards));
    dispatch(assetActions.setPaymentMethods(paymentMethods));
    dispatch(settingActions.setSettings(settings));

    // set default budget data
    const { budget: defaultBudget } = await getBudgetById(defaultBudgetId);
    dispatch(budgetActions.setDefaultBudget(defaultBudget));

    // set budget data
    const { budgets } = await getBudgetList();
    dispatch(budgetActions.setBudgetList(budgets));

    navigate(from || '/budget', { replace: true });
  };

  // Set state
  const setEmailAuth = () => {
    setIsEmailAuth(true);
  };

  const setSNSAuth = () => {
    setIsEmailAuth(false);
  };

  const toggleIsLogin = () => {
    setIsLogin((prev) => !prev);
  };

  if (isFirstLoad) {
    return (
      <div className={`${classes.full} ${classes.center}`}>
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <>
        <Overlay
          className={`${classes.auth} ${isEmailAuth ? classes.email : classes.sns}`}
          isOpen={true}
        >
          {isEmailAuth ? (
            <EmailForm
              isLogin={isLogin}
              toggleIsLogin={toggleIsLogin}
              changeAuthType={setSNSAuth}
              getUserLogin={getUserLogin}
            />
          ) : (
            <SNSForm
              isLogin={isLogin}
              toggleIsLogin={toggleIsLogin}
              changeAuthType={setEmailAuth}
              getUserLogin={getUserLogin}
            />
          )}
        </Overlay>
        <Modal />
      </>
    );
  }
}

export const loader = async () => {
  return getUserState();
};

export default Auth;
