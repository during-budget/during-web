import RadioTab from '../UI/RadioTab';
import classes from './StatusHeader.module.css';

function StatusHeader(props: { id: string; title: string; values: any }) {
    return (
        <div className={classes.container}>
            <h5>{props.title}</h5>
            <RadioTab name={props.id} values={props.values} />
        </div>
    );
}

export default StatusHeader;
