import { useEffect, useRef, useState } from 'react';
import { ActionFunctionArgs, useNavigate } from 'react-router';
import { useFetcher } from 'react-router-dom';
import { ERROR_MESSAGE } from '../../constants/error';
import useInput from '../../hooks/useInput';
import { useToggle } from '../../hooks/useToggle';
import { UserDataType } from '../../util/api/userAPI';
import { throwError } from '../../util/error';
import { fetchRequest } from '../../util/request';
import CodeField, { CODE_LENGTH } from '../Auth/CodeField';
import Button from '../UI/button/Button';
import Inform from '../UI/Inform';
import InputField from '../UI/InputField';

const EMAIL_VALIDATE_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const EmailForm = () => {
  const navigate = useNavigate();
  const fetcher = useFetcher<LocalAuthResponse>();

  const codeRef = useRef<any>(null);
  const persistRef = useRef<HTMLInputElement>(null);

  const submitting = fetcher.state === 'submitting';

  const [values, changeHandler, _, clearForm] = useInput();
  const [isDisabled, disableEmail, enableEmail] = useToggle(false);

  const [isVerify, setIsVerify] = useState(false);
  const [errorState, setErrorState] = useState<String>('');

  useEffect(() => {
    const { data, formData } = fetcher;

    const intent = formData?.get('intent');

    if (intent) {
      setErrorState('');
    }

    if (data instanceof Error) {
      setErrorState(data.message);
      return;
    }

    switch (intent) {
      case 'send':
        if (
          data?.message === 'LOGIN_VERIFICATION_CODE_SENT' ||
          'REGISTER_VERIFICATION_CODE_SENT' ||
          'EMAIL_UPDATE_VERIFICATION_CODE_SENT'
        ) {
          disableEmail();
          setIsVerify(true);
        }
        break;
      case 'verify':
        if (!data) {
          break;
        }

        const { message, user } = data;

        if (!user) {
          throw new Error('사용자 정보를 불러올 수 없습니다.');
        }

        if (message === 'REGISTER_SUCCESS') {
          navigate('/budget/init');
        } else if (message === 'LOGIN_SUCCESS') {
          navigate('/budget');
        } else {
          setErrorState(ERROR_MESSAGE[message]);
        }
        break;
    }
  }, [fetcher.data]);

  // Focus email input on First load
  useEffect(() => {
    if (isVerify) {
      codeRef.current && codeRef.current.focus();
    } else if (!isDisabled) {
      focusEmail();
    }
  }, [isVerify, isDisabled]);

  const focusEmail = () => {
    const emailInput = document.getElementById('auth-email-input') as HTMLInputElement;
    emailInput?.focus({ preventScroll: true });
  };

  // Error message JSXElement
  const errorMessage = errorState && (
    <Inform
      isError={true}
      css={{ marginTop: '0.5vh', marginBottom: '2vh' }}
      isFlex={true}
      isLeft={true}
    >
      <p>{errorState}</p>
    </Inform>
  );

  return (
    <div className="flex-column i-center mx-3" css={{ marginTop: '8vh' }}>
      <fetcher.Form className="w-100" action="/landing" method="post" noValidate>
        <InputField id="auth-email-field" className="mb-0.5">
          <div className="flex j-between i-center">
            <label htmlFor="auth-email-input">이메일로 시작</label>
            {isVerify && (
              <Button
                type="submit"
                sizeClass="sm"
                name="intent"
                value="send"
                onClick={disableEmail}
              >
                재전송
              </Button>
            )}
          </div>

          <input
            id="auth-email-input"
            type="email"
            name="email"
            value={values.get('email') || ''}
            onChange={changeHandler}
            readOnly={isDisabled}
            required
          />
        </InputField>
        {isVerify ? (
          <>
            <CodeField className="mb-1.25" ref={codeRef} />
            {errorMessage}
            <Button
              type="submit"
              name="intent"
              value="verify"
              onClick={disableEmail}
              isPending={submitting}
            >
              인증하기
            </Button>
            <div className="flex j-between i-center mb-0.625 px-0.5">
              <div className="flex i-center shrink-0 gap-xs text-md">
                <input
                  id="auth-email-persist"
                  ref={persistRef}
                  type="checkbox"
                  defaultChecked={true}
                />
                <label htmlFor="auth-email-persist">자동 로그인</label>
              </div>
              <Button
                styleClass="extra"
                className="j-end"
                onClick={async () => {
                  clearForm();
                  enableEmail();
                  setIsVerify(false);
                }}
              >
                <u className="text-md regular">이메일 다시 입력하기</u>
              </Button>
            </div>
          </>
        ) : (
          <>
            {errorMessage}
            <Button type="submit" name="intent" value="send" isPending={submitting}>
              인증코드 전송
            </Button>
          </>
        )}
      </fetcher.Form>
    </div>
  );
};

export default EmailForm;

interface LocalAuthResponse {
  message: string;
  user?: UserDataType;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get('intent');

  // send email - get email
  const email = formData.get('email') as string;

  if (!email) {
    return new Error('이메일을 입력하세요.');
  } else if (!EMAIL_VALIDATE_REGEX.test(email)) {
    return new Error('올바른 이메일을 입력하세요.');
  }

  // send email - send request
  if (intent === 'send') {
    try {
      const response = await fetchRequest<LocalAuthResponse>({
        url: '/auth/local',
        method: 'post',
        body: { email },
      });
      return response;
    } catch (error) {
      return throwError(error);
    }
  }

  // verify code - get code, persist
  const code = Array.from(new Array(CODE_LENGTH))
    .map((_, i) => {
      return formData.get(`code-${i}`);
    })
    .join('');

  if (code.trim().length < 6) {
    return new Error('인증 코드 여섯자리를 모두 입력하세요.');
  }

  const persist = formData.get('persist');

  // verify code - send request
  try {
    const response = await fetchRequest<LocalAuthResponse>({
      url: '/auth/local',
      method: 'post',
      body: { email, code, persist },
    });
    return response;
  } catch (error) {
    return throwError(error);
  }
};
