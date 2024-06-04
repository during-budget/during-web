import React, { PropsWithChildren, useState } from 'react';
import { useAppDispatch } from '../../../hooks/useRedux';
import { uiActions } from '../../../store/ui';
import { getErrorMessage } from '../../../util/error';
import ConfirmCancelButtons, {
  ConfirmCancelButtonsProps,
} from '../button/ConfirmCancelButtons';
import Overlay, { OverlayProps } from './Overlay';

interface OverlayFormProps {
  overlayOptions: Omit<OverlayProps, 'className'>;
  confirmCancelOptions?: ConfirmCancelButtonsProps;
  onSubmit: () => Promise<void>;
  onError?: (error: unknown) => void; 
  formHeight?: string;
  formPadding?: 'lg' | 'md' | 'sm';
  className?: string;
  isOuterPending?: boolean;
  outerPending?: boolean;
}

const OverlayForm = ({
  overlayOptions,
  confirmCancelOptions,
  onSubmit,
  onError,
  formHeight,
  formPadding,
  isOuterPending,
  outerPending,
  className,
  children,
}: PropsWithChildren<OverlayFormProps>) => {
  const dispatch = useAppDispatch();
  const [isPending, setIsPending] = useState(false);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setIsPending(true);
      await onSubmit();
      setIsPending(false);
    } catch (error) {
      const message = getErrorMessage(error);
      onError && onError(error);
      setIsPending(false);
      dispatch(
        uiActions.showErrorModal({
          description: message || '잠시 후 다시 시도해주세요.',
        })
      );
      if (!message) throw error;
    }
  };

  // TODO: p-lg, p-md, p-sm 추후 정의
  const paddingClass = `p-${
    formPadding === 'lg' ? 2.875 : formPadding === 'md' ? 2 : 1.125
  }`;

  return (
    <Overlay {...overlayOptions} className={`${className}`}>
      <form onSubmit={submitHandler} className={paddingClass}>
        <div className="scroll" style={{ height: formHeight }}>
          {children}
          {!formHeight && <div className="w-100" css={{ height: 'calc(6vh + 56px)' }} />}
        </div>
        <ConfirmCancelButtons
          onClose={overlayOptions.onClose}
          isClose={!overlayOptions.isOpen}
          isPending={isOuterPending ? outerPending : isPending}
          {...confirmCancelOptions}
        />
      </form>
    </Overlay>
  );
};

export default OverlayForm;
