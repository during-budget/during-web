import { useEffect, useState } from 'react';
import { ScrollRestoration, useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import EmojiOverlay from '../components/UI/EmojiOverlay';
import UserCategorySetting from '../components/User/Category/UserCategorySetting';
import UserHeader from '../components/User/Profile/UserHeader';
import SettingList from '../components/User/Setting/SettingList';
import ChartSkinSetting from '../components/User/Skin/ChartSkinSetting';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hook';
import { userActions } from '../store/user';
import { deleteUser, logoutUser } from '../util/api/userAPI';
import classes from './User.module.css';

import Modal from '../components/UI/Modal';
import { uiActions } from '../store/ui';
import {
  SnsIdType,
  defaultSnsId,
  disconnectSnsId,
  getAuthURL,
  getSnsId,
  providers,
} from '../util/api/snsIdAPI';

function User() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showCategory, setShowCategory] = useState(false);
  const [showChartSkin, setShowChartSkin] = useState(false);
  const { email, defaultBudgetId } = useAppSelector((state) => state.user.info);

  const [snsId, setSnsId] = useState<SnsIdType>(defaultSnsId);

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
      title: '로그인 설정',
      items: providers.map((provider) => {
        return snsId[provider.provider]
          ? {
              icon: provider.icon,
              label: `${provider.label} 로그인 해제`,
              onClick: async () => {
                try {
                  const data = await disconnectSnsId(provider.provider);
                  dispatch(uiActions.showModal({ icon: '✓', title: '해제 완료' }));
                  if (data?.snsId) {
                    setSnsId(data.snsId);
                  }
                } catch (error: any) {
                  if (error.message) {
                    dispatch(uiActions.showModal({ description: error.message }));
                  } else {
                    dispatch(uiActions.showErrorModal());
                  }
                }
              },
            }
          : {
              icon: provider.icon,
              label: `${provider.label} 계정 연결하기`,
              onClick: async () => {
                window.open(getAuthURL(provider.provider), '_self');
              },
            };
      }),
    },
    // {
    //   title: '기본 설정',
    //   items: [
    //     {
    //       icon: '➕',
    //       label: '크기 설정',
    //       onClick: () => {},
    //     },
    //     {
    //       icon: '🎨',
    //       label: '색상 설정',
    //       onClick: () => {},
    //     },
    //     {
    //       icon: '🌏',
    //       label: '언어 설정',
    //       onClick: () => {},
    //     },
    //   ],
    // },
    // {
    //   title: '회원 설정',
    //   items: [
    //     {
    //       icon: '👤',
    //       label: '회원 정보 수정하기',
    //       onClick: () => {},
    //     },
    //   ],
    // },
  ];

  const logoutHandler = async () => {
    await logoutUser();
    dispatch(userActions.logout());
    navigate('/auth', { replace: true });
  };

  const deleteHandler = async () => {
    if (
      confirm('계정을 삭제할까요?\n 모든 정보가 삭제되며 복구할 수 없습니다.') === false
    )
      return;
    await deleteUser();
    dispatch(userActions.logout());
    navigate('/auth', { replace: true });
  };

  useEffect(() => {
    getSnsId().then((data) => {
      if (data?.snsId) {
        setSnsId(data.snsId);
      }
    });
    return () => {};
  }, []);

  return (
    <>
      <ScrollRestoration />
      <UserHeader email={email} svg="/assets/svg/basic_profile.svg" />
      <main className={classes.container}>
        <section>
          {settings.map((data, i) => (
            <SettingList key={i} title={data.title} items={data.items} />
          ))}
          <div className={classes.buttons}>
            <Button styleClass="extra" className={classes.logout} onClick={deleteHandler}>
              탈퇴하기
            </Button>
            |
            <Button styleClass="extra" className={classes.logout} onClick={logoutHandler}>
              로그아웃
            </Button>
          </div>
        </section>
        <section>
          <UserCategorySetting isOpen={showCategory} setIsOpen={setShowCategory} />
          <ChartSkinSetting isOpen={showChartSkin} setIsOpen={setShowChartSkin} />
        </section>
      </main>
      <EmojiOverlay />
      <Modal />
    </>
  );
}

export default User;
