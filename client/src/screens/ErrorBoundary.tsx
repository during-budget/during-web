import { Navigate, useLocation, useRouteError } from 'react-router-dom';

function ErrorBoundary() {
    const routeError: any = useRouteError();
    const location = useLocation();

    if (routeError.status === 403) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // TODO: 에러 페이지 보완
    console.log(routeError);
    return <>{routeError}</>;
}

export default ErrorBoundary;
