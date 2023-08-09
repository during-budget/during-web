import { Link, Outlet, useLocation } from 'react-router-dom';
import classes from './Layout.module.css';
import RequireAuth from './RequireAuth';

function Nav() {
  const loacation = useLocation();

  const navData = [
    { path: '/budget', icon: <i className="fa-solid fa-home"></i> },
    { path: '/asset', icon: <i className="fa-solid fa-sack-dollar"></i> },
    { path: '/store', icon: <i className="fa-solid fa-store"></i> },
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

  const isDefaultBudget =
    loacation.search === '?isDefault' || location.pathname.includes('/default');
  const isInit = location.pathname === '/init';

  return (
    <RequireAuth>
      <Outlet />
      {!isDefaultBudget && !isInit && <nav className={classes.nav}>{navList}</nav>}
    </RequireAuth>
  );
}

export default Nav;
