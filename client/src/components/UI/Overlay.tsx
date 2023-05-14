import { useEffect } from 'react';
import classes from './Overlay.module.css';

function Overlay(props: {
  isOpen: boolean;
  onClose?: () => void;
  disableTranslate?: boolean;
  isClip?: boolean;
  isHideBackdrop?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  // NOTE: disable body scroll
  useEffect(() => {
    if (props.isOpen) {
      document.body.style.setProperty('overflow', 'hidden');
    } else {
      document.body.style.setProperty('overflow', 'scroll');
    }
  }, [props.isOpen]);

  return (
    <div
      className={`${classes.container} ${props.isOpen ? classes.open : ''} ${
        props.isClip ? classes.clip : ''
      }`}
    >
      <div
        className={`${classes.backdrop} ${props.isHideBackdrop ? '' : classes.show}`}
        onClick={props.onClose}
      ></div>
      <div className={`${classes.overlay} ${props.className}`}>{props.children}</div>
    </div>
  );
}

export default Overlay;
