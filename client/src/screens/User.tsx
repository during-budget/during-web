import { useState } from 'react';
import { ScrollRestoration, useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import EmojiOverlay from '../components/UI/EmojiOverlay';
import UserCategorySetting from '../components/User/Category/UserCategorySetting';
import UserHeader from '../components/User/Profile/UserHeader';
import SettingList from '../components/User/Setting/SettingList';
import ChartSkinSetting from '../components/User/Skin/ChartSkinSetting';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hook';
import { userActions } from '../store/user';
import { logoutUser } from '../util/api/userAPI';
import classes from './User.module.css';

function User() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showCategory, setShowCategory] = useState(false);
  const [showChartSkin, setShowChartSkin] = useState(false);
  const { email, userName, defaultBudgetId } = useAppSelector((state) => state.user.info);

  const settings = [
    {
      title: '가계부 설정',
      items: [
        {
          icon: '💰',
          label: '기본 예산 설정',
          onClick: () => {
            navigate(`/budget/default/${defaultBudgetId}`);
          },
        },
        {
          icon: '🔖',
          label: '카테고리 설정',
          onClick: () => {
            setShowCategory(true);
          },
        },
        {
          icon: '💍',
          label: '차트 캐릭터 설정',
          onClick: () => {
            setShowChartSkin(true);
          },
        },
      ],
    },
    {
      title: '기본 설정',
      items: [
        {
          icon: '➕',
          label: '크기 설정',
          onClick: () => {},
        },
        {
          icon: '🎨',
          label: '색상 설정',
          onClick: () => {},
        },
        {
          icon: '🌏',
          label: '언어 설정',
          onClick: () => {},
        },
      ],
    },
    {
      title: '회원 설정',
      items: [
        {
          icon: '👤',
          label: '회원 정보 수정하기',
          onClick: () => {},
        },
      ],
    },
  ];

  const logoutHandler = () => {
    logoutUser();
    dispatch(userActions.logout());
    navigate('/auth', { replace: true });
  };

  return (
    <>
      <ScrollRestoration />
      <UserHeader userName={userName} email={email} />
      <main className={classes.container}>
        <section>
          {settings.map((data, i) => (
            <SettingList key={i} title={data.title} items={data.items} />
          ))}
          <Button styleClass="extra" className={classes.logout} onClick={logoutHandler}>
            로그아웃
          </Button>
        </section>
        <section>
          <UserCategorySetting isOpen={showCategory} setIsOpen={setShowCategory} />
          <ChartSkinSetting isOpen={showChartSkin} setIsOpen={setShowChartSkin} />
        </section>
      </main>
      <EmojiOverlay />
    </>
  );
}

export default User;
