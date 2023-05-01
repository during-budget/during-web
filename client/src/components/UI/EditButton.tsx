import Button from './Button';
import classes from './EditButton.module.css';

interface EditButton {
  onClick: () => void;
  label: string;
}

const EditButton = ({ onClick, label }: EditButton) => {
  return (
    <Button styleClass="extra" onClick={onClick}>
      <span className={classes.edit}>{label}</span>
    </Button>
  );
};

export default EditButton;
