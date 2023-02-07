import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import classes from './Nav.module.css';

const navData = [
    { path: '/budget', icon: <i className="fa-solid fa-sack-dollar"></i> },
    { path: '/during', icon: <i className="fa-solid fa-circle-dot"></i> },
    { path: '/user', icon: <i className="fa-solid fa-user"></i> },
];

function Nav() {
    const loacation = useLocation();

    const navList = navData.map((item) => {
        const className = `${classes.link} ${
            loacation.pathname.includes(item.path) && classes.active
        }`;
        return (
            <Link key={item.path} to={item.path} className={className}>
                {item.icon}
            </Link>
        );
    });

    return (
        <div>
            <Outlet />
            <nav className={classes.nav}>{navList}</nav>
        </div>
    );
}

export default Nav;
