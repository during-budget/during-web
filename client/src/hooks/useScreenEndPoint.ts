import { useEffect, useState } from 'react';

const LARGE_SCREEN = '(min-width: 480px)';
const SMALL_SCREEN = '(max-width: 380px)';

const useScreenEndPoint = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(
    window.matchMedia(LARGE_SCREEN).matches
  );
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.matchMedia(SMALL_SCREEN).matches
  );

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.matchMedia(LARGE_SCREEN).matches);
      setIsSmallScreen(window.matchMedia(SMALL_SCREEN).matches);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return [isLargeScreen, isSmallScreen];
};

export default useScreenEndPoint;
