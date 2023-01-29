import { Fragment, useEffect, useState } from 'react';
import Amount from '../../models/Amount';
import BarChart from '../UI/BarChart';
import classes from './AmountRing.module.css';

const RING_SIZE = '16rem';
const RING_DASH = 482.5;

const EARS = require('../../assets/svg/cat_ears.svg').default;

function AmountRing(props: { amount: Amount }) {
    const [isOverAmount, setIsOverAmount] = useState(false);
    const [overState, setOverState] = useState<(JSX.Element | undefined)[]>([]);

    const amount = props.amount;

    useEffect(() => {
        const overMsg = amount.state
            .map((item: any) => {
                if (item.isTrue) {
                    return (
                        <p key={item.target}>
                            <i className="fa-solid fa-circle-exclamation" />
                            <strong>{item.target}</strong>
                            {`이 ${item.over}보다 `}
                            <strong>{item.amount}원</strong> 더 큽니다.
                        </p>
                    );
                }
            })
            .filter((item) => item);

        setOverState(overMsg);

        if (overMsg.length) {
            setIsOverAmount(true);
        } else {
            setIsOverAmount(false);
        }
    }, [amount.state]);

    const getDash = (ratio: number) => {
        if (isOverAmount) {
            return { strokeDasharray: `0 ${RING_DASH}` };
        }
        const dash = ratio * RING_DASH;
        return { strokeDasharray: `${dash} ${RING_DASH}` };
    };

    const getRotate = (ratio: number) => {
        if (isOverAmount) {
            return { transform: `rotate(0deg) scale(0.95)`, opacity: 0 };
        }

        const deg = ratio * 360;
        return { transform: `rotate(${deg}deg) scale(0.95)` };
    };

    return (
        <Fragment>
            {isOverAmount && (
                <>
                    <div className={`error ${classes.errors}`}>{overState}</div>
                </>
            )}
            <div
                className={classes.container}
                style={{ width: RING_SIZE, height: RING_SIZE }}
            >
                {/* Budget */}
                <div>
                    <div className={classes.palette}>
                        <svg width="100%" height="100%">
                            <circle
                                className={classes.budget}
                                r="30%"
                                cx="50%"
                                cy="50%"
                                style={getDash(1)}
                            />
                        </svg>
                    </div>
                </div>
                {/* Scheduled */}
                <div>
                    <div className={`${classes.palette} ${classes.rounded}`}>
                        <svg width="100%" height="100%">
                            <circle
                                className={classes.scheduled}
                                r="30%"
                                cx="50%"
                                cy="50%"
                                style={getDash(amount.getScheduledRatio())}
                            />
                        </svg>
                    </div>
                </div>
                {/* RingScheduled */}
                <div
                    className={`${classes.ring} ${classes.ringScheduled}`}
                    style={getRotate(amount.getScheduledRatio())}
                >
                    <div
                        className={classes.ears}
                        style={{
                            mask: `url(${EARS})`,
                            WebkitMask: `url(${EARS})`,
                        }}
                    />
                    <div className={classes.eyes} />
                </div>
                {/* Current */}
                <div>
                    <div className={`${classes.palette} ${classes.rounded}`}>
                        <svg width="100%" height="100%">
                            <circle
                                className={classes.current}
                                r="30%"
                                cx="50%"
                                cy="50%"
                                style={getDash(amount.getCurrentRatio())}
                            />
                        </svg>
                    </div>
                </div>
                {/* RingCurrnet */}
                <div
                    className={`${classes.ring} ${classes.ringCurrent}`}
                    style={getRotate(amount.getCurrentRatio())}
                >
                    <div
                        className={classes.ears}
                        style={{
                            mask: `url(${EARS})`,
                            WebkitMask: `url(${EARS})`,
                        }}
                    />
                    <div className={classes.eyes} />
                </div>
                {/* Bar Chart */}
                <BarChart
                    data={[
                        {
                            color: 'var(--primary)',
                            amount: isOverAmount ? amount.current : 0,
                        },
                        {
                            color: 'var(--secondary)',
                            amount: isOverAmount ? amount.scheduled : 0,
                        },
                        {
                            color: 'var(--background)',
                            amount: isOverAmount ? amount.planned : 0,
                        },
                    ]}
                />
            </div>

            <svg
                style={{ visibility: 'hidden', position: 'absolute' }}
                width="0"
                height="0"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
            >
                <defs>
                    <filter id="rounded">
                        <feGaussianBlur
                            in="SourceGraphic"
                            stdDeviation="6"
                            result="blur"
                        />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                            result="rounded"
                        />
                        <feComposite
                            in="SourceGraphic"
                            in2="rounded"
                            operator="atop"
                        />
                    </filter>
                </defs>
            </svg>
        </Fragment>
    );
}

export default AmountRing;
