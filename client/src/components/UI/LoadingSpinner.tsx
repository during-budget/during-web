import classes from './LoadingSpinner.module.css';
import Mask from './Mask';

interface LoadingSpinner {
  size?: string;
  isFull?: boolean;
}

const LoadingSpinner = (props: LoadingSpinner) => {
  const size = props.size ?? '3rem';

  return (
    <div className={props.isFull ? classes.full : ''}>
      <div className={classes.loading} style={{ width: size, height: size }}>
        <Mask
          className={`${classes.spinner} ${classes.gray}`}
          mask="/assets/svg/cat_spinner.svg"
        />
        <Mask
          className={`${classes.spinner} ${classes.secondary}`}
          mask="/assets/svg/cat_spinner.svg"
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
