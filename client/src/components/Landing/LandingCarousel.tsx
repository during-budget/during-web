import Carousel from '../UI/Carousel';

import animationDual from '../../assets/lottie/landing_dual.json';
import animationDuring from '../../assets/lottie/landing_during.json';
import animationRing from '../../assets/lottie/landing_ring.json';
import classes from './LandingCarousel.module.css';
import LandingItem from './LandingItem';

const LandingCarousel = () => {
  return (
    <Carousel id="landing_carousel" containerClassName={classes.landingCarousel}>
      <LandingItem
        title="DURING"
        description="한 달 동안"
        lottieClassName={classes.lottieLg}
        animationData={animationDuring}
      />
      <LandingItem
        title="DUAL"
        description="두 가지 기록을"
        lottieClassName={classes.lottieLg}
        animationData={animationDual}
      />
      <LandingItem
        title="RING"
        description="링 차트와 함께"
        lottieClassName={classes.lottieSm}
        animationData={animationRing}
      />
    </Carousel>
  );
};

export default LandingCarousel;
