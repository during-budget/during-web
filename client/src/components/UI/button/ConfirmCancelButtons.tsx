import { css } from '@emotion/react';
import Button from './Button';
import { cn } from '../../../util/cn';

export interface ConfirmCancelButtonsProps {
  onClose?: () => void;
  onConfirm?: () => void;
  closeMsg?: string;
  confirmMsg?: string;
  className?: string;
  disabled?: boolean;
  hideCancle?: boolean;
  disableSubmit?: boolean;
  isClose?: boolean;
  isPending?: boolean;
  isBottomSticky?: boolean;
}

function ConfirmCancelButtons({
  onClose,
  onConfirm,
  closeMsg,
  confirmMsg,
  className,
  disabled,
  hideCancle,
  disableSubmit,
  isClose,
  isPending,
  isBottomSticky,
}: ConfirmCancelButtonsProps) {
  const containerStyle = (isClose?: boolean) =>
    css({
      position: 'absolute',
      // TODO: 1.125를 오버레이폼 패딩이랑 같은 변수로 일치시키기
      left: '1.125rem',
      right: '1.125rem',
      bottom: '6vh',
      display: 'flex',
      transform: isClose ? 'translateY(300%)' : 'translateY(0)',
      transition: 'transform 0.3s var(--fast-in)',
      willChange: 'transform',
      // '& button:disabled': {
      //   opacity: 1
      // }
      // 왜??
    });

  return (
    <div
      className={isBottomSticky ? cn('flex', className) : className || ''}
      css={!isBottomSticky && containerStyle(isClose)}
    >
      {!hideCancle && (
        <Button
          className="w-50"
          styleClass="extra"
          onClick={onClose}
          disabled={isPending}
        >
          {closeMsg || '취소'}
        </Button>
      )}
      <Button
        type={disableSubmit ? undefined : 'submit'}
        styleClass="primary"
        onClick={onConfirm}
        isPending={isPending}
        disabled={isPending || disabled}
      >
        {confirmMsg || '완료'}
      </Button>
    </div>
  );
}

export default ConfirmCancelButtons;
