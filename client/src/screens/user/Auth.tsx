import classes from './Auth.module.css';
import AuthForm from './AuthForm';

function Auth() {
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
                <AuthForm />
            </div>
        </>
    );
}

export default Auth;
