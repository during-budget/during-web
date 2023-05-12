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
    : undefined;

  const { amount, r } = props;

  const currentRatio = amount.getCurrentRatio();
  const scheduledRatio = amount.getScheduledRatio();

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
    return { transform: `rotate(${deg}deg) scale(${props.skinScale})`, opacity };
  };

  const hideRounded =
    (skinData &&
      (currentDeg > skinData.hideRoundedDeg || scheduledDeg > skinData.hideRoundedDeg)) ||
    currentDeg === 360 ||
    scheduledDeg === 360;

  const hideCover = skinData
    ? currentDeg > skinData?.hideCoverDeg || scheduledDeg > skinData?.hideCoverDeg
    : 1;

  const rings = [
    { className: classes.budget, dash: getDash(1), r },
    {
      className: classes.scheduled,
      dash: getDash(scheduledRatio),
      rotate: getRotate(scheduledRatio),
      r,
      showCap: scheduledDeg < 350 && scheduledDeg > 0,
      showEyes: scheduledDeg > 10,
      isBigger: scheduledDeg >= currentDeg,
      almostFull: scheduledDeg >= 350,
    },
    {
      className: classes.current,
      dash: getDash(currentRatio),
      rotate: getRotate(currentRatio),
      r,
      showCap: currentDeg < 350 && currentDeg > 0,
      showEyes: currentDeg > 10,
      isBigger: currentDeg >= scheduledDeg,
      almostFull: currentDeg >= 350,
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
          skin={skinData && skinData.path}
          showCap={data.showCap}
          isBigger={data.isBigger}
          showEyes={data.showEyes}
          almostFull={data.almostFull}
        />
      ))}
      <div className={classes.rounded} style={{ opacity: hideRounded ? 0 : 1 }} />
      <div className={classes.cover} style={{ opacity: hideCover ? 0 : 1 }} />
    </div>
  );
}

export default AmountRing;
