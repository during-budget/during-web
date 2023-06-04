import Button from '../../UI/Button';
import Mask from '../../UI/Mask';
import classes from './UserHeader.module.css';

interface UserHeaderProps {
  email?: string;
  userName?: string;
  isGuest?: boolean;
  img?: string;
  svg?: string;
  openAuth: () => void;
}

function UserHeader({ email, userName, isGuest, img, svg, openAuth }: UserHeaderProps) {
  const guestHeader = (
    <div className={classes.guest}>
      <h3>둘러보는 중이에요</h3>
      <Button onClick={openAuth}>계정 등록을 진행해주세요</Button>
      <p>
        ⚠️ 탈퇴 및 세션 만료 등으로 인해 접속이 중단될 시<br />
        <strong>
          <u>계정 데이터를 복구할 수 없습니다.</u>
        </strong>
      </p>
    </div>
  );

  return (
    <header className={classes.userHeader}>
      <div
        className={classes.profile}
        style={{
          backgroundImage: `url("${img || ''}")`,
          backgroundSize: 'cover',
        }}
      >
        {svg && <Mask className={classes.primary} mask={svg} />}
        {/* <input type="file" accept="image/*"></input> */}
      </div>
      {isGuest ? (
        guestHeader
      ) : (
        <>
          <h1>{isGuest ? '둘러보는 중이에요' : userName}</h1>
          <h5>{isGuest ? userName : email}</h5>
        </>
      )}
    </header>
  );
}

export default UserHeader;
