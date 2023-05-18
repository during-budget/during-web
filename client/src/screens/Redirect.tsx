import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useEffect } from 'react';

const Redirect = () => {
  const navigate = useNavigate();

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  // useEffect(() => {
  //   navigate(-1);
  // }, []);

  return (
    <div style={containerStyle}>
      <LoadingSpinner />
    </div>
  );
};

export default Redirect;
