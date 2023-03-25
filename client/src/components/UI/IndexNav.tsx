import NavButton from './NavButton';
import classes from './IndexNav.module.css';

function IndexNav(props: {
    idx: number;
    setIdx: (param: any) => void;
    data: any[];
}) {
    const lastIdx = props.data.length - 1;

    const plusIdx = () => {
        props.setIdx((prevIdx: any) => {
            const nextIdx = prevIdx === lastIdx ? 0 : prevIdx + 1;
            return nextIdx;
        });
    };

    const minusIdx = () => {
        props.setIdx((prevIdx: any) => {
            const nextIdx = prevIdx === 0 ? lastIdx : prevIdx - 1;
            return nextIdx;
        });
    };

    return (
        <div className={classes.container}>
            <NavButton onClick={minusIdx} isNext={false} />
            <div>{props.data[props.idx]}</div>
            <NavButton onClick={plusIdx} isNext={true} />
        </div>
    );
}

export default IndexNav;
