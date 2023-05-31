import { PropsWithChildren } from 'react';
import classes from './Button.module.css';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event?: React.MouseEvent) => void;
  isPending?: boolean;
  disabled?: boolean;
  styleClass?: 'primary' | 'secondary' | 'extra' | 'gray';
  sizeClass?: 'lg' | 'md' | 'sm';
  children?: React.ReactNode;
}

function Button({
  type,
  className,
  style,
  onClick,
  isPending,
  disabled,
  styleClass,
  sizeClass,
  children,
}: PropsWithChildren<ButtonProps>) {
  const styleClassName = classes[styleClass!] || classes.primary;
  const sizeClassName = classes[sizeClass!] || classes.lg;

  return (
    <button
      type={type || 'button'}
      className={`${classes.button} ${styleClassName} ${sizeClassName} ${
        className || ''
      }`}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {isPending ? <LoadingSpinner size="1.5rem" /> : children}
    </button>
  );
}

export default Button;
