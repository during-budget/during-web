import classes from './BarChart.module.css';

function BarChart(props: {
    data: { amount: number; color?: string; label?: string }[];
}) {
    const amounts = props.data.map((item) => item.amount);
    const maxHeight = Math.max(...amounts);
    return (
        <ol className={classes.barHolder}>
            {props.data.map((item, i) => {
                return (
                    <li
                        key={i}
                        style={{
                            backgroundColor: item.color || 'var(--primary)',
                            height: `${
                                (maxHeight ? item.amount / maxHeight : 0) * 100
                            }%`,
                            transition: maxHeight ? '0.5s' : '0.2s',
                            transitionDelay: maxHeight ? '0.3s' : '0',
                        }}
                    ></li>
                );
            })}
        </ol>
    );
}

export default BarChart;
