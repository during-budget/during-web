import { css, keyframes } from '@emotion/react';
import Mask from './Mask';

interface LoadingSpinner {
  size?: string;
  isFull?: boolean;
}

const LoadingSpinner = (props: LoadingSpinner) => {
  const size = props.size ?? '3rem';
  const spin = keyframes`
  to {
    transform: rotate3d(0, 0, 1, 360deg);
  }
`;

  const animation = `${spin} 0.8s var(--fast-in) infinite`;

  return (
    <div className={props.isFull ? 'fixed position-0 vw-100 vh-100 flex-center' : ''}>
      <div
        className="flex-center w-100 h-100 relative"
        css={{ width: size, height: size }}
      >
        <Mask
          className="absolute bg-gray-0"
          mask="/assets/svg/cat_spinner.svg"
          css={css({ animation })}
        />
        <Mask
          className="absolute bg-secondary"
          mask="/assets/svg/cat_spinner.svg"
          css={css({ animation, animationDelay: '0.15s' })}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
