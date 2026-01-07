import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  return (
    <div
      className={`transition-opacity duration-300 ease-in-out ${
        transitionStage === 'fadeOut' ? 'opacity-0' : 'opacity-100'
      }`}
      onTransitionEnd={() => {
        if (transitionStage === 'fadeOut') {
          setTransitionStage('fadeIn');
          setDisplayLocation(location);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      }}
    >
      {children}
    </div>
  );
};
