import { Link, Outlet, useLocation } from 'react-router-dom';
import classes from './Layout.module.css';
import RequireAuth from './RequireAuth';
import { useEffect, useState } from 'react';
import AgreementOverlay from '../components/Landing/AgreementOverlay';
import { useAppSelector } from '../hooks/useRedux';
import { privacyPolicyVersion, termsOfUseVersion } from '../constants/version';

function Index() {
  const loacation = useLocation();
  const agreement = useAppSelector((state) => state.user.agreement);

  const [openAgreement, setOpenAgreement] = useState(false);

  useEffect(() => {

    if (
      agreement?.termsOfUse === termsOfUseVersion &&
      agreement?.privacyPolicy === privacyPolicyVersion
    ) {
      setOpenAgreement(false);
    } else {
      setOpenAgreement(true);
    }
  }, [agreement]);

  const navData = [
    { path: '/budget', icon: <i className="fa-solid fa-home"></i> },
    // { path: '/asset', icon: <i className="fa-solid fa-sack-dollar"></i> },
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
  const isInit = location.pathname === '/budget/init';

  return (
    <>
      <Outlet />
      {!isDefaultBudget && !isInit && <nav className={classes.nav}>{navList}</nav>}
      <AgreementOverlay
        isOpen={openAgreement}
        isInit={isInit}
        onClose={() => {
          setOpenAgreement(false);
        }}
      />
    </>
  );
}

export default Index;
