import React from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { uiActions } from '../store/ui';
import * as Sentry from '@sentry/browser';

const PaymentRedirect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const impUid = params.get('imp_uid');
  const merchantUid = params.get('merchant_uid');
  const errorCode = params.get('error_code');
  const errorMsg = params.get('error_msg');

  if (errorCode || errorMsg) {
    dispatch(
      uiActions.showModal({
        icon: '!',
        title: '결제 실패',
        description: '결제 시도 중 문제가 발생했습니다.',
      })
    );

    dispatch(
      uiActions.showModal({
        icon: '!',
        title: '결제 실패',
        description: errorMsg?.split('] ')[1] || '결제 처리 중 문제가 발생했습니다.',
      })
    );

    if (!errorMsg?.includes('PAY_PROCESS_CANCELED')) {
      Sentry.captureMessage(
        `결제오류(${merchantUid}/${impUid}): [${errorCode}] ${errorMsg}`
      );
    }
  } else {
    // 결제 정보(impUid, merchantUid)를 서버에 전달해서 결제금액의 위변조 여부를 검증한 후 최종적으로 결제 성공 여부를 판단
    dispatch(
      uiActions.showModal({
        icon: '✓',
        title: '결제 성공',
        description: `${merchantUid}\n${impUid}`,
      })
    );
  }

  return <Navigate to="/user" />;
};

export default PaymentRedirect;
