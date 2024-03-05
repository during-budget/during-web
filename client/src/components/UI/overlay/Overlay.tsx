import { css } from '@emotion/react';
import { PropsWithChildren, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

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
  isCenter?: boolean;
  isRight?: boolean;
  isLeft?: boolean;
  disableBackdrop?: boolean;
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
  isCenter,
  isRight,
  isLeft,
  disableBackdrop,
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
      // onClose();
    }
  }, [location]);

  const overlayStyle = (isCenter?: boolean) => {
    return css({
      '@media screen and (min-width: 840px)': {
        left: isCenter ? 'unset' : isLeft ? '0' : 'unset',
        right: isCenter ? 'unset' : isRight ? '0' : 'unset',
        width: '50%',
      },
    });
  };

  const openStyle = css({
    '& .overlay-container': {
      boxShadow: '0px 4px 60px rgba(99, 99, 99, 0.2)',
      maxHeight: '95vh',
    },
    '& .overlay-transform': {
      transform: 'translateY(0)',
    },
    '& .overlay-backdrop': {
      visibility: 'visible',
      opacity: 0.6,
    },
  });

  const clipStyle = css({
    '& .overlay-container': {
      boxShadow: '0px 4px 60px rgba(99, 99, 99, 0.2)',
      maxHeight: '100%',
    },
    '& .overlay-height': {
      maxHeight: '100%',
    },
    '& .overlay-transform': {
      transform: 'translateY(0)',
    },
  });

  // NOTE: fixed로 인해 드래그앤 드롭을 위한 dnd와 transform을 동시에 사용할 수 없어 max-height 조작
  const heightStyle = (isCenter?: boolean) =>
    css(overlayStyle(isCenter), {
      maxHeight: 0,
      transition:
        'max-height 0.3s var(--slow-in), clip-path 0.3s var(--slow-in), boxShadow 0.3s var(--slow-in)',
      willChange: 'max-height, clip-path, box-shadow',
    });

  // NOTE: 애니메이션 최적화를 위해 transform 사용
  const transformStyle = (isCenter?: boolean) =>
    css(overlayStyle(isCenter), {
      transform: 'translateY(100%)',
      transition:
        'transform 0.3s var(--slow-in), clip-path 0.3s var(--slow-in), box-shadow 0.3s var(--slow-in)',
      willChange: 'transform, clip-path, box-shadow',
    });

  const backdropStyle = (isHide?: boolean, isOpen?: boolean) =>
    css({
      opacity: isHide ? 0 : isOpen ? 0.6 : 0,
      visibility: isHide ? 'hidden' : isOpen ? 'visible' : 'hidden',
      transition: 'opacity 0.3s var(--slow-in), opacity 0.3s var(--slow-in)',
      willChange: 'opacity, visibility',
    });

  return (
    <div
      className="fixed left-0 right-0 z-2 flex j-center"
      css={isOpen ? openStyle : isClip ? { ...openStyle, ...clipStyle } : undefined}
    >
      <div
        className="overlay-backdrop fixed position-0 v-hidden bg-black o-0"
        css={backdropStyle(isHideBackdrop, isOpen)}
        onClick={() => {
          !disableBackdrop && onClose();
        }}
      ></div>
      <div
        className={`overlay-container border-box fixed-important bottom-0 w-100 round-top-1\.5xl bg-white shadow-0 z-3 ${
          noTransition ? '' : noTransform ? 'overlay-height' : 'overlay-transform'
        } ${className || ''}`}
        css={
          noTransition
            ? overlayStyle(isCenter)
            : noTransform
            ? heightStyle(isCenter)
            : transformStyle(isCenter)
        }
      >
        {children}
      </div>
    </div>
  );
}

export default Overlay;
