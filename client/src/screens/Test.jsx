import { useLoaderData } from 'react-router-dom';
import { getTestData } from '../util/api';

function Test() {
    const loaderData = useLoaderData();
    return (
        <div
            style={{
                textAlign: 'center',
                fontSize: '3rem',
                marginTop: '6rem',
                fontWeight: '600',
            }}
        >
            {loaderData.message}
        </div>
    );
}

export const loader = () => {
    return getTestData();
};

export default Test;
