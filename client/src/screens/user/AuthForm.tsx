import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import classes from './Auth.module.css';
import { userActions } from '../../store/user';
import { login, register } from '../../util/api';

function AuthForm() {
    const dispatch = useDispatch();
    const naviation = useNavigate();

    const [isLoginMode, setIsLoginMode] = useState(true);
    const [userNameState, setUserNameState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const [errorState, setErrorState] = useState<String[]>([]);

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
        naviation('/budget');
    };

    return (
        <>
            <div className={classes.errors}>
                {errorState.map((error) => (
                    <p className={classes.error}>{error}</p>
                ))}
            </div>
            <form className={classes.form} onSubmit={submitHandler}>
                {!isLoginMode && <h3>Create Account</h3>}
                <div className={`input-field ${classes.field}`}>
                    <input
                        id="user-name"
                        name="user-name"
                        value={userNameState}
                        onChange={changeUserNameHandler}
                        required
                        autoFocus
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
        </>
    );
}

export default AuthForm;
