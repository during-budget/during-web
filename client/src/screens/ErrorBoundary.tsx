import { useAsyncError, useRouteError } from 'react-router-dom';

function ErrorBoundary() {
    const asyncError: any = useAsyncError();
    const routeError: any = useRouteError();

    return (
        <div
            className="page error"
            style={{ marginTop: '10rem', padding: '3rem' }}
        >
            <p>
                <strong>ERROR!</strong>
            </p>
            {asyncError && <p>{asyncError!.message}</p>}
            {routeError && (
                <>
                    <p>
                        {routeError!.status} {routeError!.statusText}
                    </p>
                    <p>{routeError!.data}</p>
                </>
            )}
        </div>
    );
}

export default ErrorBoundary;
