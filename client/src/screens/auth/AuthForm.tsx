import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classes from './Auth.module.css';
import { userActions } from '../../store/user';
import { login, register } from '../../util/api';

function AuthForm(props: { from?: string }) {
    const dispatch = useDispatch();
    const navigation = useNavigate();

    const userNameRef = useRef<HTMLInputElement>(null);

    const [isLoginMode, setIsLoginMode] = useState(true);
    const [userNameState, setUserNameState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const [errorState, setErrorState] = useState<String[]>([]);

    const from = props.from;

    useEffect(() => {
        if (from) {
            setErrorState([`You must log in to view the page at ${from}`]);
        }
    }, [from]);

    useEffect(() => {
        userNameRef.current!.focus();
    }, [isLoginMode, errorState]);

    const changeModeHandler = () => {
        setIsLoginMode((prevState) => !prevState);
        setErrorState([]);
    };

    const changeUserNameHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setUserNameState(event.target.value);
    };

    const changePasswordHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPasswordState(event.target.value);
    };

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            if (isLoginMode) {
                await login(userNameState, passwordState);
            } else {
                await register(userNameState, passwordState);
            }
        } catch (error) {
            let message;
            if (error instanceof Error) {
                message = error.message;
            } else {
                message = String(error);
            }

            setUserNameState('');
            setPasswordState('');

            setErrorState(message.split('\n'));
            throw new Error(message);
        }

        setUserNameState('');
        setPasswordState('');
        dispatch(userActions.login());
        navigation(from || '/budget', { replace: true });
    };

    return (
        <div>
            {errorState.length !== 0 && (
                <div className={`error ${classes.error}`}>
                    {errorState.map((error, i) => (
                        <p key={i}>{error}</p>
                    ))}
                </div>
            )}
            <form className={classes.form} onSubmit={submitHandler}>
                {!isLoginMode && <h3>Create Account</h3>}
                <div className={`input-field ${classes.field}`}>
                    <input
                        ref={userNameRef}
                        id="user-name"
                        name="user-name"
                        value={userNameState}
                        onChange={changeUserNameHandler}
                        required
                    />
                    <label htmlFor="user-name">Username</label>
                </div>
                <div className={`input-field ${classes.field}`}>
                    <input
                        id="password"
                        type="password"
                        value={passwordState}
                        onChange={changePasswordHandler}
                        required
                    />
                    <label htmlFor="password">Password</label>
                </div>
                <button
                    type="submit"
                    className={`button__primary ${classes.submit}`}
                    name="type"
                    value={isLoginMode ? 'login' : 'register'}
                >
                    {isLoginMode ? 'Login' : 'Register'}
                </button>
                <div className={classes.links}>
                    {isLoginMode && (
                        <>
                            <button type="button" className={classes.link}>
                                Guest Login
                            </button>
                            <span> | </span>
                        </>
                    )}
                    <button
                        type="button"
                        className={classes.link}
                        onClick={changeModeHandler}
                    >
                        {isLoginMode ? 'Register' : 'Back to Login'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AuthForm;
