import classes from './UserHeader.module.css';

function UserHeader(props: { userName: string; email: string; img?: string }) {
    return (
        <header className={classes.container}>
            <div
                className={classes.profile}
                style={{
                    backgroundImage: `url("${props.img || ''}")`,
                    backgroundSize: 'cover',
                }}
            >
                <input type="file" accept="image/*"></input>
            </div>
            <h1>{props.userName}</h1>
            <p>{props.email}</p>
        </header>
    );
}

export default UserHeader;
