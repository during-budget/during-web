import classes from './Ring.module.css';

function Ring(props: {
  className?: string;
  r: string;
  blur: number;
  dash: { strokeWidth: string; strokeDasharray: string };
}) {
  return (
    <>
      <div className={`${classes.ring} ${classes.rounded}`}>
        <svg width="100%" height="100%">
          <circle
            className={props.className}
            r={props.r}
            cx="50%"
            cy="50%"
            style={props.dash}
          ></circle>
        </svg>
      </div>
    </>
  );
}

export default Ring;
