import Mask from '../../UI/Mask';
import classes from './Ring.module.css';

interface RingProps {
  className?: string;
  r: string;
  dash: React.CSSProperties;
  skin?: string;
  rotate?: React.CSSProperties;
  isBigger?: boolean;
  showEyes?: boolean;
  showCap?: boolean;
}

function Ring({
  className,
  r,
  dash,
  skin,
  rotate,
  showCap,
  showEyes,
  isBigger,
}: RingProps) {
  return (
    <>
      <div className={`${classes.ring} ${classes.rounded}`}>
        <svg width="100%" height="100%">
          <circle className={className} r={r} cx="50%" cy="50%" style={dash}></circle>
        </svg>
      </div>
      {!skin && (
        <div
          className={classes.cap}
          style={{
            ...rotate,
            opacity: showCap ? 1 : 0,
            backgroundColor: isBigger ? 'var(--gray-1)' : 'var(--secondary)',
          }}
        />
      )}
      {skin && (
        <div className={`${classes.skin}`} style={rotate}>
          <Mask
            className={`${className} ${classes.ears}`}
            mask={`url('/src/assets/svg/${skin}_ears.svg`}
          />
          <div className={classes.eyes} style={{ opacity: showEyes ? 1 : 0 }} />
          <Mask
            className={classes.line}
            style={{ opacity: isBigger ? 1 : 0 }}
            mask={`url('/src/assets/svg/${skin}_line.svg`}
          />
        </div>
      )}
    </>
  );
}

export default Ring;
