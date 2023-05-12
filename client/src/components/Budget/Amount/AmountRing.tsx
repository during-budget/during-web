import { useAppSelector } from '../../../hooks/redux-hook';
import Amount from '../../../models/Amount';
import classes from './AmountRing.module.css';
import Ring from './Ring';

interface SkinDataType {
  [key: string]: { path: string; hideRoundedDeg: number; hideCoverDeg: number };
}

export const SKIN_DATA: SkinDataType = {
  CAT: {
    path: 'cat',
    hideRoundedDeg: 352,
    hideCoverDeg: 340,
  },
  BUNNY: {
    path: 'bunny',
    hideRoundedDeg: 338,
    hideCoverDeg: 320,
  },
  BEAR: {
    path: 'bear',
    hideRoundedDeg: 351,
    hideCoverDeg: 340,
  },
  BASIC: {
    path: 'basic',
    hideRoundedDeg: 360,
    hideCoverDeg: 340,
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
  const skin = useAppSelector((state) => state.user.info.chartSkin);
  const skinKey = skin.toUpperCase();
  const skinData = Object.keys(SKIN_DATA).includes(skinKey)
    ? SKIN_DATA[skinKey]
    : SKIN_DATA.BASIC;

  const { amount, r } = props;

  const currentRatio = amount.getCurrentRatio();
  const scheduledRatio = currentRatio + amount.getScheduledRatio();

  const currentDeg = currentRatio <= 1 ? currentRatio * 360 : 360;
  const scheduledDeg = scheduledRatio <= 1 ? scheduledRatio * 360 : 360;

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
    return {
      transform: `rotate(${deg}deg) scale(${props.skinScale}) translate3d(0, 0, 0)`,
      opacity,
    };
  };

  const isBasic = skinData.path === 'basic';

  const hideRounded =
    currentDeg > skinData.hideRoundedDeg ||
    scheduledDeg > skinData.hideRoundedDeg ||
    currentDeg === 360 ||
    scheduledDeg === 360;

  const hideCover =
    currentDeg > skinData.hideCoverDeg || scheduledDeg > skinData.hideCoverDeg;

  const rings = [
    { className: classes.budget, dash: getDash(1), r },
    {
      className: classes.scheduled,
      dash: getDash(scheduledRatio),
      rotate: getRotate(scheduledRatio),
      r,
      showEyes: !isBasic && scheduledDeg > 10,
      isFront: scheduledDeg > currentDeg && scheduledDeg >= 350, // almostFull
    },
    {
      className: classes.current,
      dash: getDash(currentRatio),
      rotate: getRotate(currentRatio),
      r,
      showEyes: !isBasic && currentDeg > 10,
      showLine: !isBasic && currentDeg >= scheduledDeg && currentDeg >= 350, // almostFull
    },
  ];

  return (
    <div className={classes.container} style={{ width: props.size, height: props.size }}>
      {rings.map((data, i) => (
        <Ring
          key={i}
          idx={i}
          className={data.className}
          dash={data.dash}
          rotate={data.rotate}
          r={data.r}
          skin={skinData ? skinData.path : 'basic'}
          showEyes={data.showEyes}
          showLine={data.showLine}
          isFront={data.isFront}
        />
      ))}
      <div className={classes.rounded} style={{ opacity: hideRounded ? 0 : 1 }} />
      <div className={classes.cover} style={{ opacity: hideCover ? 0 : 1 }} />
    </div>
  );
}

export default AmountRing;
