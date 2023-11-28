import { SettingOverlayProps } from '../../../screens/User';
import Button from '../../UI/button/Button';
import Overlay from '../../UI/overlay/Overlay';
import classes from './Buisness.module.css';

const Buisness = ({ isOpen, onClose }: SettingOverlayProps) => {
  return (
    <Overlay
      id="buisness-info"
      className={classes.buisness}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className={classes.info}>
        <h1>Whaleap Studio</h1>
        <p>
          <strong>사업자등록번호 |</strong> 423-11-02401
        </p>
        <p>
          <strong>대표 |</strong> 이윤지
        </p>
        <p>
          <strong>주소 |</strong> 경기도 고양시 일산동구 고일로 171 101-902
        </p>
        <p>
          <strong>연락처 |</strong> 0507-0177-7002
        </p>
      </div>
      <Button onClick={onClose}>닫기</Button>
    </Overlay>
  );
};

export default Buisness;
