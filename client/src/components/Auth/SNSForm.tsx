import { useState } from 'react';
import classes from './SNSForm.module.css';
import Button from '../UI/Button';

function SNSForm(props: {
    isLogin: boolean;
    toggleIsLogin: () => void;
    changeAuthType: () => void;
    getUserLogin: (user: any) => void;
}) {
    const { isLogin, toggleIsLogin } = props;

    return (
        <div className={classes.container}>
            <img src="/assets/png/logo.png" alt="듀링 가계부 로고" />
            <h2>{isLogin ? '로그인' : '회원가입'}</h2>
            <form>
                <Button styleClass="extra" onClick={props.changeAuthType}>
                    이메일로 {isLogin ? '로그인' : '회원가입'}
                </Button>
                <div className={classes.buttons}>
                    <Button
                        styleClass="extra"
                        onClick={() => {
                            // TODO: 게스트 로그인 요청
                        }}
                    >
                        가입 없이 둘러보기
                    </Button>
                    |{' '}
                    <Button
                        styleClass="extra"
                        onClick={() => {
                            toggleIsLogin();
                        }}
                    >
                        {isLogin ? '회원가입하기' : '로그인하기'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default SNSForm;
