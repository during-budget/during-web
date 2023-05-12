import { useEffect } from 'react';
import { useLocation, useNavigate, useRouteError } from 'react-router-dom';

function ErrorBoundary() {
  const routeError: any = useRouteError();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (routeError.status === 403) {
      navigate(`/auth`, { replace: true, state: { from: location } });
    } else {
      // TODO: 에러 페이지 보완
      console.log(routeError);
    }
  }, [routeError.status]);

  return <div>error!</div>;
}

export default ErrorBoundary;
