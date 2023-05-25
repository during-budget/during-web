import React, { PropsWithChildren, useState } from 'react';
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
  const [isPending, setIsPending] = useState(false);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setIsPending(true);
      await onSubmit();
      setIsPending(false);
    } catch (error) {
      if (error instanceof Error) {
        setIsPending(false);
        console.log(error.name, error.message);
      } else {
        console.log('문제가 발생하였습니다');
      }
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
