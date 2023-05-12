import Mask from '../../UI/Mask';
import classes from './UserHeader.module.css';

interface UserHeaderProps {
  email: string;
  img?: string;
  svg?: string;
}

function UserHeader({ email, img, svg }: UserHeaderProps) {
  return (
    <header className={classes.container}>
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
      {/* <h1>{userName}</h1> */}
      <h5>{email}</h5>
    </header>
  );
}

export default UserHeader;
