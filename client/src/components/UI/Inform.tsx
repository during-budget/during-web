import { PropsWithChildren } from 'react';
import classes from './Inform.module.css';

interface InfomProps {
  isError?: boolean;
  className?: string;
  hideIcon?: boolean;
  isThin?: boolean;
  isHide?: boolean;
  isLeft?: boolean;
  isFlex?: boolean;
}

const Inform = ({
  isError,
  className,
  hideIcon,
  isThin,
  isHide,
  isFlex,
  isLeft,
  children,
}: PropsWithChildren<InfomProps>) => {
  const msgClass = isError ? classes.error : classes.inform;
  const thinClass = isThin ? classes.thin : '';

  return (
    <div
      className={`${classes.msg} ${msgClass} ${thinClass} ${isHide ? classes.hide : ''} ${
        isFlex ? classes.flex : ''
      } ${isLeft ? classes.left : ''} ${className || ''}`}
    >
      {!hideIcon && <i className={`fa-solid fa-circle-exclamation ${classes.icon}`} />}
      {children}
    </div>
  );
};

export default Inform;
