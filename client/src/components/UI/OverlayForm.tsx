import React, { PropsWithChildren, useState } from 'react';
import { useAppDispatch } from '../../hooks/redux-hook';
import { uiActions } from '../../store/ui';
import { getErrorMessage } from '../../util/error';
import ConfirmCancelButtons, { ConfirmCancelButtonsProps } from './ConfirmCancelButtons';
import Overlay, { OverlayProps } from './Overlay';
import classes from './OverlayForm.module.css';

interface OverlayFormProps {
  overlayOptions: Omit<OverlayProps, 'className'>;
  confirmCancelOptions?: ConfirmCancelButtonsProps;
  onSubmit: () => Promise<void>;
  formHeight?: string;
  formPadding?: 'lg' | 'md' | 'sm';
  className?: string;
}

const OverlayForm = ({
  overlayOptions,
  confirmCancelOptions,
  onSubmit,
  formHeight,
  formPadding,
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
      setIsPending(false);
      dispatch(
        uiActions.showErrorModal({
          description: message || '잠시 후 다시 시도해주세요.',
        })
      );
      if (!message) throw error;
    }
  };

  const paddingClass = `padding-${formPadding || 'md'}`;

  return (
    <Overlay {...overlayOptions} className={`${classes.overlayForm} ${className}`}>
      <form onSubmit={submitHandler} className={classes[paddingClass]}>
        <div className={classes.container} style={{ height: formHeight }}>
          {children}
        </div>
        <ConfirmCancelButtons
          onClose={overlayOptions.onClose}
          isClose={!overlayOptions.isOpen}
          isPending={isPending}
          {...confirmCancelOptions}
        />
      </form>
    </Overlay>
  );
};

export default OverlayForm;
