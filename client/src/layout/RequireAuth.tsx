import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux-hook';

function RequireAuth(props: { children: React.ReactNode }) {
    const auth = useAppSelector((state) => state.user.isAuth);
    const location = useLocation();

    if (!auth) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <>{props.children}</>;
}

export default RequireAuth;
