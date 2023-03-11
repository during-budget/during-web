import classes from './Ring.module.css';

function Ring(props: {
    className?: string;
    r: string;
    blur: number;
    dash: { strokeWidth: string; strokeDasharray: string };
}) {
    return (
        <>
            <div className={`${classes.ring} ${classes.rounded}`}>
                <svg width="100%" height="100%">
                    <circle
                        className={props.className}
                        r={props.r}
                        cx="50%"
                        cy="50%"
                        style={props.dash}
                    ></circle>
                </svg>
            </div>

            {/* NOTE: filter for round corner */}
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
                            stdDeviation={props.blur}
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
        </>
    );
}

export default Ring;
