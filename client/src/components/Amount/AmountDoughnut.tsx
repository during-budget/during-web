import { Fragment } from 'react';
import Amount from '../../models/Amount';
import classes from './AmountDoughnut.module.css';

const DOUGHNUT_SIZE = '16rem';
const DOUGHNUT_DASH = 402;

const getDash = (ratio: number) => {
    return { strokeDasharray: `${ratio * DOUGHNUT_DASH} ${DOUGHNUT_DASH}` };
};

function AmountDoughnut(props: { amount: Amount }) {
    const amount = props.amount;

    return (
        <Fragment>
            <div
                className={classes.container}
                style={{ width: DOUGHNUT_SIZE, height: DOUGHNUT_SIZE }}
            >
                <div>
                    <div className={classes.palette}>
                        <svg width="100%" height="100%">
                            <circle
                                className={classes.budget}
                                r="25%"
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
                                r="25%"
                                cx="50%"
                                cy="50%"
                                style={getDash(amount.getScheduledRatio())}
                            />
                        </svg>
                    </div>
                </div>
                <div>
                    <div className={`${classes.palette} ${classes.rounded}`}>
                        <svg width="100%" height="100%">
                            <circle
                                className={classes.current}
                                r="25%"
                                cx="50%"
                                cy="50%"
                                style={getDash(amount.getCurrentRatio())}
                            />
                        </svg>
                    </div>
                </div>

                <div className={`${classes.cat} ${classes.scheduledCat}`}>
                    <div className={classes.ears} />
                    <div className={classes.eyes} />
                </div>

                <div className={`${classes.cat} ${classes.currentCat}`}>
                    <div className={classes.ears} />
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

export default AmountDoughnut;
