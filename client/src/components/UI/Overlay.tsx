import { PropsWithChildren, useEffect } from 'react';
import classes from './Overlay.module.css';

interface OverlayProps {
  isOpen: boolean;
  onClose?: () => void;
  isClip?: boolean;
  isHideBackdrop?: boolean;
  noTransform?: boolean;
  noTransition?: boolean;
  className?: string;
}

function Overlay({
  isOpen,
  onClose,
  isClip,
  isHideBackdrop,
  noTransform,
  noTransition,
  className,
  children,
}: PropsWithChildren<OverlayProps>) {
  // NOTE: disable body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.setProperty('overflow', 'hidden');
    } else {
      document.body.style.setProperty('overflow', 'scroll');
    }
  }, [isOpen]);

  return (
    <div
      className={`${classes.overlayContainer} ${isOpen ? classes.open : ''}  ${
        isClip ? classes.clip : ''
      }`}
    >
      <div
        className={`${classes.backdrop} ${isHideBackdrop ? '' : classes.show}`}
        onClick={onClose}
      ></div>
      <div
        className={`${classes.overlay} ${
          noTransition ? '' : noTransform ? classes.height : classes.transform
        } ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

export default Overlay;
