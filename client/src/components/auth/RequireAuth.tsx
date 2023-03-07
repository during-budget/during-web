import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

function RequireAuth(props: { children: React.ReactNode }) {
    const auth = useSelector((state: any) => state.user.isAuth);
    const location = useLocation();

    if (!auth) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <>{props.children}</>;
}

export default RequireAuth;
