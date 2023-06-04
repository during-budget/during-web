import { SettingOverlayProps } from '../../../screens/User';
import Button from '../../UI/Button';
import Overlay from '../../UI/Overlay';
import classes from './Developers.module.css';

const Developers = ({ isOpen, onClose }: SettingOverlayProps) => {
  const data = [
    {
      id: 'lynj',
      profile: '/images/profile/whale.png',
      name: 'Lynj',
      role: ['Product Manage', 'Design', 'Frontend'],
      github: 'https://github.com/navynj',
      email: 'mailto:navyoonj@gmail.com',
    },
    {
      id: 'jessie',
      profile: '/images/profile/fox.png',
      name: 'Jessie',
      role: ['Backend'],
      github: 'https://github.com/jessie129j',
      email: 'mailto:jessie129j@gmail.com',
    },
  ];

  return (
    <Overlay
      className={classes.developers}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className={classes.header}>
        <h4>TEAM</h4>
        <h1>WHALEFOX</h1>
      </div>
      <ul className={classes.list}>
        {data.map((item) => (
          <li key={item.id} className={classes[item.id]}>
            <img className={classes.profile} src={item.profile} />
            <div className={classes.info}>
              <h5>{item.name}</h5>
              <ul className={classes.link}>
                <li>
                  <a href={item.github} target="_blank">
                    <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" />
                  </a>
                </li>
                <li>
                  <a href={item.email}>
                    <i className="fa-solid fa-envelope"></i>
                  </a>
                </li>
              </ul>
            </div>
            <ul className={classes.role}>
              {item.role.map((content, i) => (
                <p key={i}>{content}</p>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <Button
        onClick={onClose}
      >
        닫기
      </Button>
    </Overlay>
  );
};

export default Developers;
