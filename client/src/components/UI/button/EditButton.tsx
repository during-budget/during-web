import { css } from '@emotion/react';
import Button from './Button';
import classes from './EditButton.module.css';

interface EditButton {
  onClick: () => void;
  label: string;
  icon?: string;
}

const EditButton = ({ onClick, label, icon }: EditButton) => {
  const buttonStyle = css({
    position: 'relative'
  });

  const iconStyle = css({
    position: 'absolute',
    top: '1.125rem',
    left: 'calc(-1 * 1.125rem)',  
  })
  
  return (
    <Button styleClass="extra" onClick={onClick}>
      <span className="text-md py-1" css={buttonStyle}>
        <i className={`fa-solid fa-${icon || 'pencil'} text-sm`} css={iconStyle} />
        {label}
      </span>
    </Button>
  );
};

export default EditButton;
