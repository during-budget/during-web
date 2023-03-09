import RadioTab from '../UI/RadioTab';
import classes from './StatusHeader.module.css';

function StatusHeader(props: { id: string; title: string; values: any; className?: string }) {
    return (
        <div className={`${classes.container} ${props.className}`}>
            <h5>{props.title}</h5>
            <RadioTab name={props.id} values={props.values} />
        </div>
    );
}

export default StatusHeader;
