import { css } from '@emotion/react';
import { PropsWithChildren } from 'react';

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
  const errorStyle = css({
    color: 'var(--error-text)',
    backgroundColor: 'var(--error-bg)',
  });

  const informStyle = css({
    color: 'var(--gray-300)',
    backgroundColor: 'var(--gray-0)',
  });

  const containerStyle = css({
    transform: isHide ? 'scaleY(0) translateY(100%)' : undefined,
    transition: 'transform 0.15s var(--fast-in)',
    willChange: 'transform',
    '& *': {
      color: 'inherit',
    },
    '& strong': {
      fontSize: '1rem',
    },
  });

  return (
    <div
      className={`p-0.8 text-center text-md round-md ${isThin ? 'regular' : 'semi-bold'}${
        isLeft ? 'flex j-start i-center' : isFlex ? 'flex-center' : ''
      } ${className || ''}`}
      css={css(isError ? errorStyle : informStyle, containerStyle)}
    >
      {!hideIcon && (
        <i
          className={`fa-solid fa-circle-exclamation color-inherit`}
          css={{ marginRight: '0.3rem' }}
        />
      )}
      {children}
    </div>
  );
};

export default Inform;
