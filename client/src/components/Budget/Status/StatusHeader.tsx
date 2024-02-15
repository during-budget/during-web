import { cn } from '../../../util/cn';
import RadioTab from '../../UI/input/RadioTab';

function StatusHeader(props: {
  id: string;
  title: string;
  values?: any;
  tab?: any;
  className?: string;
}) {
  return (
    <div className={cn('w-100 flex j-between', props.className)}>
      <h5>{props.title}</h5>
      {props.values && <RadioTab name={props.id} values={props.values} />}
      {props.tab}
    </div>
  );
}

export default StatusHeader;
