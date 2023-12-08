import RadioTab from '../../UI/input/RadioTab';
import classes from './StatusHeader.module.css';

function StatusHeader(props: {
    id: string;
    title: string;
    values?: any;
    tab?: any;
    className?: string;
}) {
    return (
        <div className={`${classes.container} ${props.className}`}>
            <h5>{props.title}</h5>
            {props.values && <RadioTab name={props.id} values={props.values} />}
            {props.tab}
        </div>
    );
}

export default StatusHeader;
