import { PropsWithChildren } from 'react';
import LoadingSpinner from '../component/LoadingSpinner';
import { SerializedStyles, css } from '@emotion/react';
import { cn } from '../../../util/cn';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  css?: SerializedStyles;
  onClick?: (event?: React.MouseEvent) => void;
  name?: string;
  value?: string;
  isPending?: boolean;
  disabled?: boolean;
  styleClass?: 'primary' | 'secondary' | 'extra' | 'gray';
  sizeClass?: 'xl' | 'lg' | 'md' | 'sm';
  fontSize?: string;
  children?: React.ReactNode;
}

function Button({
  type,
  className,
  onClick,
  isPending,
  name,
  value,
  disabled,
  styleClass,
  sizeClass,
  fontSize,
  css: propsStyle,
  children,
}: PropsWithChildren<ButtonProps>) {
  let style = css({
    color: 'var(--white)',
    backgroundColor: 'var(--primary)',
  });

  let size = css({
    height: '3rem',
    fontSize: `var(--text-${fontSize ? fontSize : 'base'})`,
  });

  switch (styleClass) {
    case 'secondary':
      style = css({
        color: 'var(--primary)',
        backgroundColor: 'var(--secondary)',
      });
      break;
    case 'extra':
      style = css({
        color: 'var(--black)',
        backgroundColor: 'transparent',
      });
      break;
    case 'gray':
      style = css({
        color: 'var(--gray-300)',
        backgroundColor: 'var(--gray-0)',
      });
      break;
  }

  switch (sizeClass) {
    case 'lg':
      size = css({
        height: '3.5rem',
        fontSize: `var(--text-${fontSize ? fontSize : 'base'})`,
        fontWeight: 700,
      });
      break;
    case 'sm':
      size = css({
        fontSize: `var(--text-${fontSize ? fontSize : 'md'})`,
        width: 'fit-content',
        height: '2rem',
        padding: '1rem',
      });
      break;
  }

  return (
    <button
      type={type || 'button'}
      className={cn('w-100 flex-center semi-bold round-sm', className)}
      css={css(style, size, propsStyle )}
      onClick={onClick}
      disabled={disabled}
      name={name}
      value={value}
    >
      {isPending ? <LoadingSpinner size="1.5rem" /> : children}
    </button>
  );
}

export default Button;
