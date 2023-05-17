import { useAppDispatch, useAppSelector } from '../../hooks/redux-hook';
import { uiActions } from '../../store/ui';
import Button from './Button';
import classes from './Modal.module.css';

const Modal = () => {
  const dispatch = useAppDispatch();

  const {
    isOpen,
    icon,
    title,
    description,
    confirmMsg,
    actionMsg,
    actionPrefix,
    onConfirm,
    onAction,
  } = useAppSelector((state) => state.ui.modal);

  const closeHandler = () => {
    dispatch(uiActions.closeModal());
  };

  const confirmHandler = () => {
    closeHandler();
    onConfirm();
  };

  return (
    <div
      className={`${classes.modalContainer} ${isOpen ? classes.open : classes.closed}`}
    >
      <div className={classes.backdrop} onClick={closeHandler} />
      <div
        className={`${classes.modal} ${
          actionMsg || actionPrefix ? classes.actionPadding : ''
        } ${icon ? classes.iconPadding : ''}`}
      >
        <div className={classes.msg}>
          {icon && <span className={classes.icon}>{icon}</span>}
          {title && <h3 className={classes.title}>{title}</h3>}
          {description && <p className={classes.description}>{description}</p>}
        </div>
        <Button onClick={confirmHandler} className={classes.confirm}>
          {confirmMsg}
        </Button>
        {(actionMsg || actionPrefix) && (
          <Button styleClass="extra" onClick={onAction} className={classes.action}>
            <span>{actionPrefix}</span>
            <u>{actionMsg}</u>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Modal;
