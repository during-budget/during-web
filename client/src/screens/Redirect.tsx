import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useAppDispatch } from '../hooks/redux-hook';
import { uiActions } from '../store/ui';

type SocialAuthMsgType =
  | 'LOGIN_SUCCESS'
  | 'REGISTER_SUCCESS'
  | 'REGISTER_FAILED_EMAIL_IN_USE'
  | 'CONNECT_FAILED_ALREADY_CONNECTED'
  | 'CONNECT_FAILED_SNSID_IN_USE'
  | 'CONNECT_SUCCESS'
  | 'AUTH_FAILED_UNKNOWN_ERROR'
  | 'INVALIED_REQUEST';

const Redirect = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [params] = useSearchParams();
  const snsLoginMsg: SocialAuthMsgType = params.get('message') as SocialAuthMsgType;

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  // 소셜 로그인 -> 모달 팝업 & 리다이렉트
  useEffect(() => {
    switch (snsLoginMsg) {
      case 'LOGIN_SUCCESS':
      case 'REGISTER_SUCCESS':
        navigate('/budget');
        return;
      case 'REGISTER_FAILED_EMAIL_IN_USE':
        dispatch(
          uiActions.showModal({
            title: '이미 사용 중인 이메일입니다',
            description: '이메일로 로그인 후 소셜 계정 연결을 진행해주세요.',
          })
        );
        navigate('/');
        break;
      case 'CONNECT_SUCCESS':
        dispatch(uiActions.showModal({ icon: '✓', title: '연결 완료' }));
        break;
      case 'CONNECT_FAILED_ALREADY_CONNECTED':
        dispatch(
          uiActions.showModal({ description: '이미 연결 완료된 소셜 계정입니다' })
        );
        break;
      case 'CONNECT_FAILED_SNSID_IN_USE':
        dispatch(
          uiActions.showModal({
            title: '이미 사용중인 소셜 계정입니다',
            description: '다른 계정으로 시도해주세요',
          })
        );
        break;
      case 'AUTH_FAILED_UNKNOWN_ERROR':
        dispatch(uiActions.showErrorModal());
        break;
      case 'INVALIED_REQUEST':
        dispatch(
          uiActions.showErrorModal({
            title: '잘못된 요청입니다.',
          })
        );
        break;
    }

    navigate('/user');
  }, [snsLoginMsg]);

  return (
    <div style={containerStyle}>
      <LoadingSpinner />
    </div>
  );
};

export default Redirect;
