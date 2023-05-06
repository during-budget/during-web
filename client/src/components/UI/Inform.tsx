import { PropsWithChildren } from 'react';
import classes from './Inform.module.css';

interface InfomProps {
  isError?: boolean;
  className?: string;
  hideIcon?: boolean;
  isThin?: boolean;
}

const Inform = ({
  isError,
  className,
  hideIcon,
  isThin,
  children,
}: PropsWithChildren<InfomProps>) => {
  const msgClass = isError ? classes.error : classes.inform;
  const thinClass = isThin ? classes.thin : '';
  return (
    <div className={`${classes.msg} ${msgClass} ${thinClass} ${className}`}>
      {!hideIcon && <i className={`fa-solid fa-circle-exclamation ${classes.icon}`} />}
      {children}
    </div>
  );
};

export default Inform;
