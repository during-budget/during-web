import Amount from '../../../models/Amount';
import classes from './AmountRing.module.css';
import Ring from './Ring';

const SKIN_DATA = {
  CAT: {
    path: 'cat',
    hideRoundedDeg: 352,
  },
  BUNNY: {
    path: 'bunny',
    hideRoundedDeg: 338,
  },
  BEAR: {
    path: 'bear',
    hideRoundedDeg: 351,
  },
};

function AmountRing(props: {
  size: string;
  thickness: string;
  r: string;
  dash: number;
  amount: Amount;
  skinScale: number;
}) {
  const skinData = SKIN_DATA.CAT;

  const { amount, r } = props;

  const currentRatio = amount.getCurrentRatio();
  const scheduledRatio = amount.getScheduledRatio();

  const currentDeg = currentRatio * 360;
  const scheduledDeg = scheduledRatio * 360;

  const getDash = (ratio: number) => {
    const dash = ratio * props.dash;
    return {
      opacity: dash ? 1 : 0,
      strokeWidth: props.thickness,
      strokeDasharray: `${dash} ${props.dash}`,
    };
  };

  const getRotate = (ratio: number) => {
    // if (isOverAmount) {
    //   return { transform: `rotate(0deg) scale(0.95)`, opacity: 0 };
    // }
    const deg = ratio <= 1 ? ratio * 360 : 360;
    const opacity = deg > 1 ? 1 : 0;
    return { transform: `rotate(${deg}deg) scale(${props.skinScale})`, opacity };
  };

  const hideRounded =
    currentDeg > skinData.hideRoundedDeg || scheduledDeg > skinData.hideRoundedDeg;

  const rings = [
    { className: classes.budget, dash: getDash(1), r },
    {
      className: classes.scheduled,
      dash: getDash(scheduledRatio),
      rotate: getRotate(scheduledRatio),
      r,
      showCap: scheduledDeg < 350 && scheduledDeg > 0,
      showEyes: scheduledDeg > 10,
      isBigger: scheduledRatio > currentRatio,
    },
    {
      className: classes.current,
      dash: getDash(currentRatio),
      rotate: getRotate(currentRatio),
      r,
      showCap: currentDeg < 350 && currentDeg > 0,
      showEyes: currentDeg > 10,
      isBigger: currentRatio > scheduledRatio,
    },
  ];

  return (
    <div className={classes.container} style={{ width: props.size, height: props.size }}>
      {rings.map((data, i) => (
        <Ring
          key={i}
          className={data.className}
          dash={data.dash}
          rotate={data.rotate}
          r={data.r}
          skin={skinData.path}
          showCap={data.showCap}
          isBigger={data.isBigger}
          showEyes={data.showEyes}
        />
      ))}
      <div className={classes.rounded} style={{ opacity: hideRounded ? 0 : 1 }} />
    </div>
  );
}

export default AmountRing;
