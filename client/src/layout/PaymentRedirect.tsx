import React from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { uiActions } from '../store/ui';
import * as Sentry from '@sentry/browser';
import { useAppSelector } from '../hooks/useRedux';
import { completePayment } from '../util/api/paymentAPI';
import { getErrorMessage } from '../util/error';

const PaymentRedirect = () => {
  const dispatch = useDispatch();

  const { onComplete } = useAppSelector((state) => state.ui.payment);

  const [params] = useSearchParams();
  const impUid = params.get('imp_uid');
  const merchantUid = params.get('merchant_uid') as string;
  const errorCode = params.get('error_code');
  const errorMsg = params.get('error_msg');

  const finishPayment = async () => {
    try {
      const { payment, message } = await completePayment({ impUid, merchantUid });

      if (message) {
        throw message;
      }

      if (payment?.status === 'paid') {
        dispatch(
          uiActions.showModal({
            icon: '✓',
            title: '결제 성공',
            hideChannelButtonOnClose: true,
          })
        );
        onComplete && onComplete(payment.itemTitle);
      } else {
        dispatch(
          uiActions.showModal({
            icon: '!',
            title: '결제 실패',
            description:
              payment?.status === 'cancelled' ? '결제가 취소되었습니다' : undefined,

            hideChannelButtonOnClose: true,
          })
        );
      }
      dispatch(uiActions.closePayment());
    } catch (error) {
      dispatch(uiActions.closePayment());
      const message = getErrorMessage(error);
      if (message) {
        dispatch(
          uiActions.showModal({
            title: '문제가 발생했습니다',
            description: message,
            hideChannelButtonOnClose: true,
          })
        );
      } else {
        dispatch(
          uiActions.showErrorModal({
            icon: '!',
            title: '결제 실패',
            description: '결제 처리 중 문제가 발생했습니다.',
            hideChannelButtonOnClose: true,
          })
        );
        throw error;
      }
    }
  };

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
    finishPayment();
  }

  return <Navigate to="/store#base" />;
};

export default PaymentRedirect;
