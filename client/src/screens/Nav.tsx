import { Link, Outlet, useLocation } from 'react-router-dom';
import classes from './Nav.module.css';

function Nav() {
    const loacation = useLocation();

    const navData = [
        { path: '/budget', icon: <i className="fa-solid fa-home"></i> },
        { path: '/during', icon: <i className="fa-solid fa-circle-dot"></i> },
        { path: '/user', icon: <i className="fa-solid fa-user"></i> },
    ];

    const navList = navData.map((data) => {
        const isCurrentPath = loacation.pathname.includes(data.path);
        const className = `${classes.link} ${isCurrentPath && classes.active}`;

        return (
            <Link key={data.path} to={data.path} className={className}>
                {data.icon}
            </Link>
        );
    });

    return (
        <>
            <Outlet />
            <nav className={classes.nav}>{navList}</nav>
        </>
    );
}

export default Nav;
