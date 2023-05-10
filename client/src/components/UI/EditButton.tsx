import Button from './Button';
import classes from './EditButton.module.css';

interface EditButton {
  onClick: () => void;
  label: string;
  isAdd?: boolean;
}

const EditButton = ({ onClick, label, isAdd }: EditButton) => {
  return (
    <Button styleClass="extra" onClick={onClick}>
      <span className={`${classes.button} ${isAdd ? classes.add : classes.edit}`}>
        {label}
      </span>
    </Button>
  );
};

export default EditButton;
