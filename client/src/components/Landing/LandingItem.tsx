import Lottie from 'lottie-react';
import classes from './LandingItem.module.css';

interface LandingItemProps {
  className?: string;
  title: string;
  description: string;
  lottieClassName?: string;
  animationData: unknown;
}

const LandingItem = ({
  className,
  title,
  description,
  lottieClassName,
  animationData,
}: LandingItemProps) => {
  return (
    <div className={`${classes.landingItem} ${className || ''}`}>
      <h2>{title}</h2>
      <Lottie className={`${lottieClassName || ''}`} animationData={animationData} />
      <p>{description}</p>
    </div>
  );
};

export default LandingItem;
