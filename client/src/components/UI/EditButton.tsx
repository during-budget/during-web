import Button from './Button';
import classes from './EditButton.module.css';

interface EditButton {
  onClick: () => void;
  label: string;
  icon?: string;
}

const EditButton = ({ onClick, label, icon }: EditButton) => {
  return (
    <Button styleClass="extra" onClick={onClick}>
      <span className={`${classes.button}`}>
        <i className={`fa-solid fa-${icon || 'pencil'}`} />
        {label}
      </span>
    </Button>
  );
};

export default EditButton;
