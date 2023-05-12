import Mask from '../../UI/Mask';
import classes from './Ring.module.css';

interface RingProps {
  idx?: number;
  className?: string;
  r: string;
  dash: React.CSSProperties;
  skin: string;
  rotate?: React.CSSProperties;
  showEyes?: boolean;
  showLine?: boolean;
  isFront?: boolean;
}

function Ring({
  idx,
  className,
  r,
  dash,
  skin,
  rotate,
  showEyes,
  showLine,
  isFront,
}: RingProps) {
  return (
    <>
      <div className={`${classes.ring} ${classes.rounded}`}>
        <svg width="100%" height="100%">
          <circle className={className} r={r} cx="50%" cy="50%" style={dash}></circle>
        </svg>
      </div>
      <div className={`${classes.skin}`} style={{ ...rotate, zIndex: isFront ? 1 : 0 }}>
        <Mask
          className={`${className} ${classes.ears}`}
          mask={`/assets/svg/${skin}_ears.svg`}
        />
        {showEyes && (
          <div className={classes.eyes} style={{ opacity: showEyes ? 1 : 0 }} />
        )}
        {showLine && (
          <Mask
            className={classes.line}
            style={{ opacity: showLine ? 1 : 0 }}
            mask={`/assets/svg/${skin}_line.svg`}
          />
        )}
      </div>
    </>
  );
}

export default Ring;
