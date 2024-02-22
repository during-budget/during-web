import { useEffect } from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router';
import AuthOverlay from '../components/Auth/AuthOverlay';
import LandingCarousel from '../components/Landing/LandingCarousel';
import Button from '../components/UI/button/Button';
import Privacy from '../components/User/Info/Privacy';
import Terms from '../components/User/Info/Terms';
import { useToggleOptions } from '../hooks/useToggle';
import { loader as userLoader } from '../layout/Root';
import { css } from '@emotion/react';
import Channel from '../models/Channel';

const { DURING_CHANNEL_KEY } = import.meta.env;

const containerStyle = {
  maxWidth: 480,
};

const buttonStyle = {
  margin: '8vh 0',
};

const Landing = () => {
  const navigate = useNavigate();
  const userData = useLoaderData() as Awaited<ReturnType<typeof userLoader>>;

  const [{ auth, terms, privacy }, open, close] = useToggleOptions({
    auth: false,
    terms: false,
    privacy: false,
  });

  const openOverlay = (hash: string) => {
    open(hash);
    Channel.hideChannelButton();
  };

  const closeOverlay = (hash: string) => {
    close(hash);
    Channel.showChannelButton();
  };

  useEffect(() => {
    if (!userData) {
      // NOTE: 오버레이를 닫아도 전체 페이지를 리로드하지 않도록 해시를 추가하여 해시 간의 이동으로 간주되도록 처리
      navigate('/landing#base', { replace: true });
    } else {
      // NOTE: 로그인된 사용자가 /landing으로 접근할 경우 서비스 화면으로 이동
      navigate('/budget', { replace: true });
    }

    // 약관 및 정책 오버레이 링크로 바로 이동 시 오버레이 뜨도록
    if (hash.includes('privacy-policy')) {
      openOverlay('privacy');
    }

    if (hash.includes('terms')) {
      openOverlay('terms');
    }

    // 채널톡
    Channel.boot({
      pluginKey: DURING_CHANNEL_KEY,
    });
  }, []);

  const location = useLocation();
  const hash = location.hash;

  return (
    <div
      id="landing-container"
      className="flex-column flex-center w-70 vh-100 mx-auto"
      css={containerStyle}
    >
      <img src="/images/logo.png" alt="듀링 가계부 로고" css={{ width: '2.5rem' }} />
      <LandingCarousel />
      <Button
        onClick={openOverlay.bind(null, 'auth')}
        sizeClass="lg"
        css={css(buttonStyle)}
      >
        듀링 가계부 시작하기
      </Button>
      <div className="w-100 flex gap-xs j-center i-center">
        <Button
          className="text-md"
          onClick={openOverlay.bind(null, 'terms')}
          styleClass="extra"
          sizeClass='sm'
        >
          이용약관
        </Button>
        <span>{' | '}</span>
        <Button
          className="mx-1.5 text-md"
          styleClass="extra"
          sizeClass='sm'
          onClick={openOverlay.bind(null, 'privacy')}
        >
          개인정보처리방침
        </Button>
      </div>
      <div className="flex-column gap-sm">
        <a href="mailto:dev.during@gmail.com" className="text-sm mt-0.3">
          이메일 문의하기 - <u>dev.during@gmail.com</u>
        </a>
      </div>
      <AuthOverlay isOpen={auth} onClose={closeOverlay.bind(null, 'auth')} />
      <Terms isOpen={terms} onClose={closeOverlay.bind(null, 'terms')} />
      <Privacy isOpen={privacy} onClose={closeOverlay.bind(null, 'privacy')} />
    </div>
  );
};

export default Landing;
