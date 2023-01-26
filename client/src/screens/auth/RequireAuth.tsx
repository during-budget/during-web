import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

function RequireAuth({ children }: { children: JSX.Element }) {
    const auth = useSelector((state: any) => state.user.isAuthenticated);
    const location = useLocation();

    if (!auth) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
}

export default RequireAuth;
