import { SKIN_DATA } from '../../../constants/chart-skin';
import { useAppSelector } from '../../../hooks/useRedux';
import Amount from '../../../models/Amount';
import Inform from '../../UI/component/Inform';
import classes from './AmountRing.module.css';
import Ring from './Ring';

function AmountRing(props: {
  size: string;
  thickness: string;
  r: string;
  dash: number;
  amount: Amount;
  skinScale: number;
  showMsg?: boolean;
  preview?: string;
}) {
  const skin = useAppSelector((state) => state.setting.chartSkin.selected);
  const skinData = Object.keys(SKIN_DATA).includes(skin)
    ? SKIN_DATA[skin]
    : SKIN_DATA.basic;

  const { size, amount, r, showMsg, preview } = props;

  const rawCurrentRatio = amount.getCurrentRatio();
  const rawScheduledRatio = rawCurrentRatio + amount.getScheduledRatio();

  const currentRatio = rawCurrentRatio <= 1 ? rawCurrentRatio : 1;
  const scheduledRatio = rawScheduledRatio <= 1 ? rawScheduledRatio : 1;

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
    return {
      transform: `rotate(${deg}deg) scale(${props.skinScale}) translate3d(0, 0, 0)`,
      opacity,
    };
  };

  const isBasic = skinData.id === 'basic';

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
      showEyes: !!preview || (!isBasic && scheduledDeg > 10),
      isFront: scheduledDeg > currentDeg && scheduledDeg >= 350, // almostFull
      showLine: scheduledDeg > currentDeg && scheduledDeg >= 350, // almostFull
    },
    {
      className: classes.current,
      dash: getDash(currentRatio),
      rotate: getRotate(currentRatio),
      r,
      showEyes: !!preview || (!isBasic && currentDeg > 10),
      showLine: !isBasic && currentDeg >= scheduledDeg && currentDeg >= 350, // almostFull
      isFront: scheduledDeg > currentDeg && scheduledDeg >= 350, // almostFull
    },
  ];

  return (
    <div className={classes.amountRing} style={{ width: size, height: size }}>
      <div className={classes.rings}>
        {rings.map((data, i) => (
          <Ring
            key={i}
            idx={i}
            className={data.className}
            dash={data.dash}
            rotate={data.rotate}
            r={data.r}
            skin={preview ? preview : skinData ? skinData.id : 'basic'}
            showEyes={data.showEyes}
            showLine={data.showLine}
            isFront={data.isFront}
          />
        ))}
        <div className={classes.rounded} style={{ opacity: hideRounded ? 0 : 1 }} />
        <div className={classes.cover} style={{ opacity: hideCover ? 0 : 1 }} />
      </div>
      {}
      <div className={classes.informs}>
        {amount.state.map((state) => (
          <Inform
            key={state.id}
            className={
              showMsg && !amount.allOverPlanned && state.isOver
                ? state.id === 'scheduled'
                  ? classes.halfUp
                  : classes.halfDown
                : ''
            }
            isError={true}
            isHide={!showMsg || !state.isOver}
          >
            <p>
              <b>{state.target}</b>이 목표보다
              <strong>{' ' + Amount.getAmountStr(state.amount) + ' '}</strong>
              많습니다.
            </p>
          </Inform>
        ))}
      </div>
    </div>
  );
}

export default AmountRing;
