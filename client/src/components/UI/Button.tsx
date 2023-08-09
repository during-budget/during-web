import { PropsWithChildren } from 'react';
import classes from './Button.module.css';
import LoadingSpinner from './LoadingSpinner';
import { css } from '@emotion/react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  css?: React.CSSProperties;
  onClick?: (event?: React.MouseEvent) => void;
  isPending?: boolean;
  disabled?: boolean;
  styleClass?: 'primary' | 'secondary' | 'extra' | 'gray';
  sizeClass?: 'xl' | 'lg' | 'md' | 'sm';
  children?: React.ReactNode;
}

function Button({
  type,
  className,
  onClick,
  isPending,
  disabled,
  styleClass,
  sizeClass,
  css,
  children,
}: PropsWithChildren<ButtonProps>) {
  let style: React.CSSProperties = {
    color: 'var(--white)',
    backgroundColor: 'var(--primary)',
  };

  let size: React.CSSProperties = {
    height: '3rem',
    fontSize: 'var(--text-base)',
  };

  switch (styleClass) {
    case 'secondary':
      style = {
        color: 'var(--primary)',
        backgroundColor: 'var(--secondary)',
      };
      break;
    case 'extra':
      style = {
        color: 'var(--black)',
        backgroundColor: 'transparent',
      };
      break;
    case 'gray':
      style = {
        color: 'var(--gray-300)',
        backgroundColor: 'var(--gray-0)',
      };
      break;
  }

  switch (sizeClass) {
    case 'lg':
      size = {
        height: '3.5rem',
        fontSize: 'var(--text-base)',
        fontWeight: 700
      };
      break;
    case 'sm':
      size = {
        fontSize: 'var(--text-md)',
        width: 'fit-content',
        height: '2rem',
        padding: '1rem',
      };
      break;
  }

  return (
    <button
      type={type || 'button'}
      className={`w-100 flex-center semi-bold round-sm ${className || ''}`}
      css={{ ...style, ...size, ...css }}
      onClick={onClick}
      disabled={disabled}
    >
      {isPending ? <LoadingSpinner size="1.5rem" /> : children}
    </button>
  );
}

export default Button;
