import { PropsWithChildren, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import classes from './Overlay.module.css';

export interface OverlayProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  isClip?: boolean;
  isHideBackdrop?: boolean;
  noTransform?: boolean;
  noTransition?: boolean;
  lockBody?: boolean;
  className?: string;
  hash?: string;
}

function Overlay({
  id,
  isOpen,
  onClose,
  isClip,
  isHideBackdrop,
  noTransform,
  noTransition,
  lockBody,
  hash,
  className,
  children,
}: PropsWithChildren<OverlayProps>) {
  const location = useLocation();
  const navigate = useNavigate();

  // NOTE: disable body scroll
  useEffect(() => {
    const body = document.querySelector('body');
    if (isOpen || lockBody) {
      body?.style.setProperty('overflow', 'hidden');
    } else {
      body?.style.setProperty('overflow', 'scroll');
    }

    if (isOpen) {
      navigate(
        `${location.pathname}${location.search}${location.hash}${hash || ''}#${id}`
      );
    } else if (location.hash.includes(id)) {
      navigate(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !location.hash.includes(id)) {
      onClose();
    }
  }, [location]);

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
