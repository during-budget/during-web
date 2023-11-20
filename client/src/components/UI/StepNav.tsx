import React from 'react';
import NavButton from './button/NavButton';
import classes from './StepNav.module.css';

interface StepNavProps {
  idx: number;
  setIdx: React.Dispatch<React.SetStateAction<number>>;
  length: number;
  onComplete?: () => void;
  className?: string;
}

const StepNav = ({ idx, setIdx, length, onComplete, className }: StepNavProps) => {
  const isComplete = idx === length - 1;
  const completeClass = isComplete ? classes.complete : '';
  const completeContent = isComplete ? '✓' : undefined;

  const hideClass = idx === 0 ? classes.hide : '';

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
    <nav className={`${classes.nav} ${className}`}>
      <NavButton className={`${classes.prev} ${hideClass}`} onClick={goPrev} />
      <div>
        <span className={classes.idx}>{idx + 1}</span> / {length}
      </div>
      <NavButton
        className={`${classes.next} ${completeClass}`}
        onClick={goNext}
        isNext={true}
        content={completeContent}
      />
    </nav>
  );
};

export default StepNav;
