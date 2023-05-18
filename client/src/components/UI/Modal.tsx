import { useAppDispatch, useAppSelector } from '../../hooks/redux-hook';
import { uiActions } from '../../store/ui';
import Button from './Button';
import classes from './Modal.module.css';

const Modal = () => {
  const dispatch = useAppDispatch();

  const { isOpen, icon, title, description, confirmMsg, onConfirm, showReport } =
    useAppSelector((state) => state.ui.modal);

  const closeHandler = () => {
    dispatch(uiActions.closeModal());
  };

  const confirmHandler = () => {
    closeHandler();
    onConfirm();
  };

  const reportHandler = () => {
    dispatch(
      uiActions.showModal({
        icon: '✓',
        title: '제보 완료',
        confirmMsg: '돌아가기',
      })
    );
  };

  return (
    <div
      className={`${classes.modalContainer} ${isOpen ? classes.open : classes.closed}`}
    >
      <div className={classes.backdrop} onClick={closeHandler} />
      <div
        className={`${classes.modal} 
        } ${icon ? classes.iconPadding : ''}`}
      >
        <div className={classes.msg}>
          {icon && <span className={classes.icon}>{icon}</span>}
          {title && (
            <h3 className={classes.title}>
              {title.split('\n').map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </h3>
          )}
          {description && <p className={classes.description}>{description}</p>}
        </div>
        <Button onClick={confirmHandler} className={classes.confirm}>
          {confirmMsg}
        </Button>
        {showReport && (
          <Button styleClass="extra" onClick={reportHandler} className={classes.action}>
            <span>문제가 계속되나요? </span>
            <u>제보하기</u>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Modal;
