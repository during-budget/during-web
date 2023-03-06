import Amount from '../../models/Amount';
import Ring from '../UI/Ring';
import classes from './AmountRing.module.css';

function AmountRing(props: {
    size: string;
    thickness: string;
    r: string;
    dash: number;
    blur: number;
    amount: Amount;
}) {
    const { amount, r, blur } = props;

    const getDash = (ratio: number) => {
        const dash = ratio * props.dash;
        return {
            strokeWidth: props.thickness,
            strokeDasharray: `${dash} ${props.dash}`,
        };
    };

    const rings = [
        { className: classes.budget, dash: getDash(1), r, blur },
        {
            className: classes.scheduled,
            dash: getDash(amount.getScheduledRatio()),
            r,
            blur,
        },
        {
            className: classes.current,
            dash: getDash(amount.getCurrentRatio()),
            r,
            blur,
        },
    ];

    return (
        <div
            className={classes.container}
            style={{ width: props.size, height: props.size }}
        >
            {rings.map((data) => (
                <Ring
                    className={data.className}
                    dash={data.dash}
                    r={data.r}
                    blur={data.blur}
                />
            ))}
        </div>
    );
}

export default AmountRing;
