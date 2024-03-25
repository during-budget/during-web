import * as Sentry from '@sentry/browser';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useRouteError } from 'react-router-dom';
import Button from '../components/UI/button/Button';
import Mask from '../components/UI/component/Mask';
import classes from './ErrorBoundary.module.css';

function ErrorBoundary() {
  const routeError: any = useRouteError();
  const navigate = useNavigate();

  const [error, setError] = useState({
    mark: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    let message = (routeError as Error).message || '';

    if (message === 'NETWORK_NOT_AVAILABLE') {
      setError({
        mark: '!',
        title: '페이지를 로드할 수 없습니다.',
        description: '네트워크 연결을 확인해주세요',
      });
    } else if (message === 'NOT_LOGGED_IN') {
      navigate('/landing#base');
    } else if (message === 'NOT_PERMITTED') {
      setError({
        mark: '!',
        title: '페이지에 접근할 수 없습니다.',
        description: '접근할 수 있는 권한이 없습니다.',
      });
    } else if (message === null) {
      setError({
        mark: '?',
        title: '페이지를 찾을 수 없습니다',
        description: '존재하지 않는 페이지입니다.',
      });
    } else {
      setError({
        mark: '!',
        title: '문제가 발생했습니다',
        description: '다시 시도해주세요.',
      });
      console.error(routeError as Error);
      Sentry.captureException(routeError);
    }
  }, [routeError]);

  return (
    <div className={classes.page}>
      <div className={classes.img}>
        <span className={classes.mark}>{error.mark}</span>
        <Mask className={classes.cat} mask="/assets/svg/cat_profile.svg" />
      </div>
      <div className={classes.error}>
        <h2>{error.title}</h2>
        <p>{error.description}</p>
      </div>
      <div className={classes.center}>
        <Link className={classes.button} to="/">
          홈 화면으로 돌아가기
        </Link>
        <p className={classes.report}>
          <span>문제가 계속되나요?</span>
          <Button
            styleClass="extra"
            onClick={() => {
              Sentry.captureMessage('⚠️ ErrorBoundary - 에러 제보');
            }}
          >
            <u>제보하기</u>
          </Button>
        </p>
      </div>
    </div>
  );
}

export default ErrorBoundary;
