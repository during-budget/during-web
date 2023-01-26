import React, { useState } from 'react';
import classes from './Auth.module.css';

function Auth() {
    const [isLoginMode, setIsLoginMode] = useState(true);

    const changeModeHandler = () => {
        setIsLoginMode((prevState) => !prevState);
    };

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
    };

    return (
        <>
            <div className={`page ${classes.page}`}>
                <div className={classes.logo}>
                    <img
                        src={require('../../assets/png/logo.png')}
                        alt="During logo"
                    ></img>
                    <h1>During Budget</h1>
                </div>

                <form className={classes.form} onSubmit={submitHandler}>
                    {!isLoginMode && <h3>Create Account</h3>}
                    <div className={`input-field ${classes.field}`}>
                        <input
                            id="user-name"
                            name="user-name"
                            required
                            autoFocus
                        />
                        <label htmlFor="user-name">Username</label>
                    </div>
                    <div className={`input-field ${classes.field}`}>
                        <input
                            id="password"
                            type="password"
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
            <div className={classes.bottom}></div>
        </>
    );
}

export default Auth;
