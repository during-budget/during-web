import * as Sentry from '@sentry/browser';
import { useEffect, useState } from 'react';
import {
  ActionFunctionArgs,
  ScrollRestoration,
  redirect,
  useNavigate,
  useSearchParams,
  useSubmit,
} from 'react-router-dom';
import Button from '../components/UI/button/Button';
import EmojiOverlay from '../components/UI/overlay/EmojiOverlay';
import UserCategorySetting from '../components/User/Category/UserCategorySetting';
import UserHeader from '../components/User/Profile/UserHeader';
import SettingList from '../components/User/Setting/SettingList';
import ChartSkinSetting from '../components/User/Skin/ChartSkinSetting';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { userActions } from '../store/user';
import classes from './User.module.css';

export interface SettingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

import Auth from '../components/Auth/AuthOverlay';
import Buisness from '../components/User/Info/Buisness';
import Developers from '../components/User/Info/Developers';
import Privacy from '../components/User/Info/Privacy';
import Terms from '../components/User/Info/Terms';
import Channel from '../models/Channel';
import { uiActions } from '../store/ui';
import {
  disconnectLocalAuth,
  disconnectSnsId,
  getAuthURL,
  getSnsId,
  providers,
} from '../util/api/authAPI';
import { getErrorMessage } from '../util/error';
import { fetchRequest } from '../util/request';

function User() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [params] = useSearchParams();
  const isRegister = params.has('register');

  const { defaultBudgetId } = useAppSelector((state) => state.user.info);
  const { isGuest, isLocal, snsId } = useAppSelector((state) => state.user.auth);
  const platform = useAppSelector((state) => state.ui.platform);

  const [showAuth, setShowAuth] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showChartSkin, setShowChartSkin] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showBuisness, setShowBuisness] = useState(false);
  const [showDevelopers, setShowDevelopers] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // NOTE: 오버레이를 닫아도 전체 페이지를 리로드하지 않도록 해시를 추가하여 해시 간의 이동으로 간주되도록 처리
    navigate('/user#base', { replace: true });
  }, []);

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
            Channel.hideChannelButton();
          },
        },
        {
          icon: '💍',
          label: '차트 캐릭터 설정',
          onClick: () => {
            setShowChartSkin(true);
            Channel.hideChannelButton();
          },
        },
      ],
    },
    {
      title: '로그인 설정',
      items: [
        ...providers
          .filter((item) => {
            // NOTE: 구글 OAuth는 웹뷰 지원 X
            if (item.provider === 'google' && platform) {
              return false;
            } else {
              return true;
            }
          })
          .map((provider) => {
            return snsId && snsId[provider?.provider]
              ? {
                  src: provider.src,
                  label: `${provider.label} 로그인 해제`,
                  onClick: async () => {
                    try {
                      const data = await disconnectSnsId(provider.provider);
                      dispatch(uiActions.showModal({ icon: '✓', title: '해제 완료' }));
                      if (data?.snsId) {
                        dispatch(userActions.setSnsId(data.snsId));
                      }
                    } catch (error) {
                      const message = getErrorMessage(error);
                      if (message) {
                        dispatch(uiActions.showModal({ description: message }));
                      } else {
                        dispatch(uiActions.showErrorModal());
                        throw error;
                      }
                    }
                  },
                }
              : {
                  src: provider.src,
                  label: `${provider.label} 계정 연결하기`,
                  onClick: async () => {
                    window.open(getAuthURL(provider.provider), '_self');
                  },
                };
          }),
        {
          icon: '✉️',
          label: isLocal ? '이메일 로그인 해제하기' : '이메일 등록하기',
          onClick: async () => {
            if (isLocal) {
              try {
                const data = await disconnectLocalAuth();
                dispatch(userActions.setAuthInfo(data));
                dispatch(uiActions.showModal({ icon: '✓', title: '해제 완료' }));
              } catch (error) {
                const message = getErrorMessage(error);
                if (message) {
                  dispatch(uiActions.showModal({ description: message }));
                } else {
                  dispatch(uiActions.showErrorModal());
                  throw error;
                }
              }
            } else {
              setShowEmailForm(true);
              Channel.hideChannelButton();
            }
          },
        },
      ],
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
    //     {
    //       icon: '🕐',
    //       label: '시간 설정',
    //       onClick: () => {},
    //     },
    //   ],
    // },
    {
      title: '서비스 정보',
      items: [
        {
          icon: '📜',
          label: '이용약관',
          onClick: () => {
            setShowTerms(true);
            Channel.hideChannelButton();
          },
        },
        {
          icon: '🔒',
          label: '개인정보처리방침',
          onClick: () => {
            setShowPrivacy(true);
            Channel.hideChannelButton();
          },
        },
        {
          icon: '📑',
          label: '사업자등록정보',
          onClick: () => {
            setShowBuisness(true);
            Channel.hideChannelButton();
          },
        },
        {
          icon: '💻',
          label: '개발자정보',
          onClick: () => {
            setShowDevelopers(true);
            Channel.hideChannelButton();
          },
        },
      ],
    },
  ];

  const logoutHandler = async () => {
    // set sentry
    Sentry.setUser(null);

    try {
      submit({ intent: 'logout' }, { method: 'post' });
      dispatch(userActions.logout());
    } catch (error) {
      dispatch(
        uiActions.showErrorModal({
          description: '로그아웃 시도 중 문제가 발생했습니다.',
        })
      );
      throw error;
    }
  };

  const deleteHandler = () => {
    // set sentry
    Sentry.setUser(null);

    dispatch(
      uiActions.showModal({
        title: '계정을 삭제할까요?',
        description: '모든 정보가 삭제되며 복구할 수 없습니다.',
        onConfirm: async () => {
          try {
            submit({ intent: 'delete' }, { method: 'post' });
            dispatch(userActions.logout());
          } catch (error) {
            dispatch(
              uiActions.showErrorModal({
                description: '회원 탈퇴 시도 중 문제가 발생했습니다.',
              })
            );
            throw error;
          }
        },
      })
    );
  };

  // TODO: 아마 신규 로그인 방법 등록에 관한 코드인 듯........ 자세히 살펴볼 것

  useEffect(() => {
    getSnsId()
      .then((data: any) => {
        if (data?.snsId) {
          dispatch(userActions.setSnsId(data.snsId));
        }
      })
      .catch((error: Error) => {
        const message = getErrorMessage(error);
        if (message) {
          uiActions.showModal({
            title: message,
          });
        } else {
          uiActions.showErrorModal();
          throw error;
        }
      });
    return () => {};
  }, []);

  // const landingHandler = (user: UserDataType) => {
  //   const { email, isLocal, snsId, isGuest } = user;
  //   setShowAuth(false);
  //   dispatch(
  //     uiActions.showModal({
  //       icon: '✓',
  //       title: '등록 성공',
  //       description: '계정 등록에 성공했습니다!',
  //     })
  //   );
  //   dispatch(
  //     userActions.setAuthInfo({
  //       email,
  //       isLocal,
  //       snsId,
  //       isGuest,
  //     })
  //   );
  // };

  useEffect(() => {
    if (showEmailForm !== undefined || isRegister) {
      setShowAuth(true);
    }
  }, [showEmailForm, isRegister]);

  const cs = (
    <div className={classes.cs}>
      <Button
        onClick={() => {
          Channel.openChat();
        }}
      >
        채팅 문의하기
      </Button>
      <a href="mailto:dev.during@gmail.com">
        이메일 문의하기 - <u>dev.during@gmail.com</u>
      </a>
    </div>
  );

  const closeHandler = (setIsOpen: React.Dispatch<boolean>) => {
    return () => {
      setIsOpen(false);
      Channel.showChannelButton();
    };
  };

  return (
    <div className={classes.user}>
      <ScrollRestoration />
      <div className={classes.header}>
        <UserHeader
          isGuest={isGuest}
          svg="/assets/svg/basic_profile.svg"
          openAuth={() => {
            setShowEmailForm(false);
          }}
        />
        <div className={classes.pc}>{cs}</div>
      </div>
      <main className={classes.main}>
        <section>
          {settings.map((data, i) => (
            <SettingList key={i} title={data.title} items={data.items} />
          ))}
          <div className={classes.mobile}>{cs}</div>
          <div className={classes.buttons}>
            <Button styleClass="extra" className={classes.logout} onClick={deleteHandler}>
              계정 삭제하기
            </Button>
            {!isGuest && (
              <>
                |
                <Button
                  styleClass="extra"
                  className={classes.logout}
                  onClick={logoutHandler}
                >
                  로그아웃
                </Button>
              </>
            )}
          </div>
        </section>
        <section>
          <UserCategorySetting
            isOpen={showCategory}
            onClose={closeHandler(setShowCategory)}
            className="p-0.75"
          />
          <ChartSkinSetting
            isOpen={showChartSkin}
            onClose={closeHandler(setShowChartSkin)}
            className="p-0.75"
          />
          <Terms isOpen={showTerms} onClose={closeHandler(setShowTerms)} />
          <Privacy isOpen={showPrivacy} onClose={closeHandler(setShowPrivacy)} />
          <Buisness isOpen={showBuisness} onClose={closeHandler(setShowBuisness)} />
          <Developers isOpen={showDevelopers} onClose={closeHandler(setShowDevelopers)} />
        </section>
      </main>
      <EmojiOverlay />
      {(isGuest || !isLocal) && (
        <Auth
          isOpen={showAuth}
          onClose={() => {
            setShowEmailForm(undefined);
            setShowAuth(false);
            Channel.showChannelButton();
          }}
          hideGuest={isGuest || !isLocal}
          showEmail={showEmailForm}
        />
      )}{' '}
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get('intent');

  switch (intent) {
    case 'disconnectLocal':
      break;
    case 'disconnentSnsId':
      break;
    case 'logout':
      await fetchRequest({ url: '/auth/logout' });
      return redirect('/landing');
    case 'delete':
      await fetchRequest({ url: '/users', method: 'delete' });
      return redirect('/landing');
  }
};

export default User;
