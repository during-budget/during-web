import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Navigate,
    useAsyncError,
    useLocation,
    useRouteError,
} from 'react-router-dom';
import { userActions } from '../store/user';

function ErrorBoundary() {
    const asyncError: any = useAsyncError();
    const routeError: any = useRouteError();

    return (
        <div className="page error" style={{ padding: '3rem' }}>
            <p>
                <strong>ERROR!</strong>
            </p>
            {asyncError && <p>{asyncError!.message}</p>}
            {routeError && (
                <>
                    <p>
                        {routeError.status} {routeError.statusText}
                    </p>
                    <p>{routeError.data || routeError.message}</p>
                </>
            )}
        </div>
    );
}

export default ErrorBoundary;
