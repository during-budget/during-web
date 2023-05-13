import classes from './LoadingSpinner.module.css';
import Mask from './Mask';

interface LoadingSpinner {
  size?: string;
}

const LoadingSpinner = (props: LoadingSpinner) => {
  const size = props.size ?? '3rem';

  return (
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
  );
};

export default LoadingSpinner;
