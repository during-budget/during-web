import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { uiActions } from '../../../store/ui';
import Button from '../button/Button';
import Channel from '../../../models/Channel';
import { useLocation } from 'react-router';
import { css } from '@emotion/react';

const Modal = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();

  const {
    isOpen,
    icon,
    title,
    description,
    confirmMsg,
    onConfirm,
    showReport,
    hideCancel,
    hideChannelButtonOnClose,
  } = useAppSelector((state) => state.ui.modal);

  const closeHandler = () => {
    dispatch(uiActions.closeModal());
  };

  const confirmHandler = () => {
    closeHandler();
    onConfirm && onConfirm();
  };

  const reportHandler = () => {
    dispatch(
      uiActions.showModal({
        icon: '✓',
        title: '제보 완료',
        confirmMsg: '돌아가기',
      })
    );
    throw new Error('⚠️ ErrorModal - 에러 제보');
  };

  useEffect(() => {
    if (isOpen) {
      Channel.hideChannelButton();
    } else if (
      (location.pathname === '/user' || location.pathname === '/landing') &&
      !hideChannelButtonOnClose
    ) {
      Channel.showChannelButton();
    }
  }, [isOpen]);

  const containerStyle = (isOpen: boolean) =>
    css({
      zIndex: isOpen ? 100 : -1,
      '& .modal': {
        transform: isOpen ? 'translate(-50%, -50%)' : 'translate(-50%, -30%)',
        opacity: isOpen ? 1 : 0,
      },
      '& .backdrop': {
        transfrom: isOpen ? 'translateY(0)' : 'translateY(100%)',
        opacity: isOpen ? 0.8 : 0,
      },
      '& .closed .backdrop': {
        opacity: 0,
      },
    });

  const modalStyle = (icon?: string) =>
    css({
      padding: icon ? '1.25rem 2rem' : '2.5rem 2rem',
      maxWidth: '360px',
      boxShadow: '0px 10px 60px rgb(0 0 0 / 50%)',
      transition: 'transform 0.3s var(--fast-in), opacity 0.25s var(--fast-in)',
      willChange: 'trasnfrom, opacity',
    });

  return (
    <div className={`fixed position-0 text-center`} css={containerStyle(isOpen)}>
      {/* backdrop */}
      <div className="backdrop absolute position-0 bg-black" onClick={closeHandler} />
      {/* modal */}
      <div
        className="modal w-75 bg-white absolute top-center left-center round-lg"
        css={modalStyle(icon)}
      >
        <div className="flex-column i-center gap-xs">
          {icon && <span className="text-3xxl semi-bold mb-0.25">{icon}</span>}
          {title && (
            <h3>
              {title.split('\n').map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </h3>
          )}
          {description && <p className="text-base">{description}</p>}
        </div>
        <div className="flex mt-1.75">
          {onConfirm && hideCancel !== true && (
            <Button onClick={closeHandler} styleClass="extra">
              취소
            </Button>
          )}
          <Button
            onClick={confirmHandler}
            className="block text-md mt-0.25"
            css={css({ height: '3.75rem' })}
          >
            {confirmMsg}
          </Button>
        </div>
        {showReport && (
          <Button
            styleClass="extra"
            onClick={reportHandler}
            className="block text-md mt-0.25"
            css={css({ height: '2.5rem' })}
          >
            <span>문제가 계속되나요? </span>
            <u>제보하기</u>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Modal;
