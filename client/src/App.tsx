import './App.css';
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from 'react-router-dom';
import Root from './screens/Root';
import Auth from './screens/Auth';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/',
                index: true,
                element: <Navigate to="/auth" />,
            },
            {
                path: '/auth',
                element: <Auth />,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
