import { css } from '@emotion/react';
import React from 'react';
import NavButton from '../button/NavButton';

interface StepNavProps {
  idx: number;
  setIdx: React.Dispatch<React.SetStateAction<number>>;
  length: number;
  onComplete?: () => void;
  className?: string;
}

const StepNav = ({ idx, setIdx, length, onComplete, className }: StepNavProps) => {
  const isComplete = idx === length - 1;
  const completeContent = isComplete ? '✓' : undefined;

  const goPrev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
    }
  };

  const goNext = () => {
    if (isComplete) {
      onComplete && onComplete();
    } else {
      setIdx(idx + 1);
    }
  };

  return (
    <nav
      className={`flex j-between i-center w-100 text-right ${className}`}
      css={css({
        '& button': {
          width: '4rem',
          height: '4rem',
          borderRadius: 'var(--round-ml)',
          fontWeight: 600,
        },
        '& button:first-child': {
          visibility: idx === 0 ? 'hidden' : 'visible',
        },
        '& button:only-child': {
          marginLeft: 'auto',
        },
      })}
    >
      <NavButton className={`text-left`} onClick={goPrev} />
      <div>
        <span className="text-xl">{idx + 1}</span> / {length}
      </div>
      <NavButton
        className="bg-primary text-white"
        onClick={goNext}
        isNext={true}
        content={completeContent}
      />
    </nav>
  );
};

export default StepNav;
