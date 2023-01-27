import { Fragment } from 'react';
import Amount from '../../models/Amount';
import classes from './AmountRing.module.css';

const RING_SIZE = '16rem';
const RING_DASH = 482.5;

const EARS = require('../../assets/svg/cat_ears.svg').default;

const getDash = (ratio: number) => {
    const dash = ratio * RING_DASH;
    return { strokeDasharray: `${dash} ${RING_DASH}` };
};

const getRotate = (ratio: number) => {
    const deg = ratio * 360;
    return { transform: `rotate(${deg}deg) scale(0.95)` };
};

function AmountRing(props: { amount: Amount }) {
    const amount = props.amount;

    return (
        <Fragment>
            <div
                className={classes.container}
                style={{ width: RING_SIZE, height: RING_SIZE }}
            >
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
