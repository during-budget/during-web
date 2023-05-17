import { useSearchParams } from 'react-router-dom';

const description: { [message: string]: string } = {
  LOGIN_SUCCESS: '소셜 계정으로 로그인에 성공했습니다.',
  REGISTER_SUCCESS: '소셜 계정으로 회원가입 후 로그인에 성공했습니다.',
  CONNECT_SUCCESS: '소셜 계정이 연결되었습니다.',
  REGISTER_FAILED_EMAIL_IN_USE:
    '이미 사용 중인 이메일입니다. 이메일로 로그인 후 소셜 계정 연결을 진행해주세요.',
  CONNECT_FAILED_ALREADY_CONNECTED: '이미 소셜 계정이 연결되었습니다.',
  CONNECT_FAILED_SNSID_IN_USE: '다른 계정에서 사용 중인 소셜 계정입니다.',
  AUTH_FAILED_UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
  INVALID_REQUEST: '유효하지 않은 요청입니다.',
};

const Redirect = () => {
  const [params] = useSearchParams();
  const message = params.get('message');

  return (
    <div style={{ padding: '48px' }}>
      <h1>Redirect Page</h1>
      <div style={{ marginTop: '24px' }}>
        {
          '1. 소셜 계정으로 로그인/회원가입 또는 마이페이지에서 소셜 계정을 연결한 경우 이 페이지로 리다이렉트됩니다.'
        }
        <br />
        {"2. 리다이렉트 시 'message'라는 쿼리 파라미터가 함께 전달됩니다."}
      </div>
      <div style={{ marginTop: '24px' }}>
        <b>message</b>
        <br />
        {message ?? 'undefined'}
      </div>
      <div style={{ marginTop: '24px' }}>
        <b>description</b>
        <br />
        {message ? description[message] : 'undefined'}
      </div>

      <div style={{ marginTop: '24px' }} />
      <a href={'/'} style={{ textDecoration: 'underline' }}>
        홈으로 이동
      </a>
    </div>
  );
};

export default Redirect;
