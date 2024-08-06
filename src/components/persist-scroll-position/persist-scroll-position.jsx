import React, { useEffect } from 'react';

export const HoldScrollPosition = ({ children }) => {
  // useEffect(() => {
  //   //   console.log('scroll position:', window.pageYOffset);
  //   //   sessionStorage.setItem('scrollPosition', window.pageYOffset);
  //   // }, [window.pageYOffset]);

  const handleScroll = () => {
    const position = window.pageYOffset;
    console.log('Scroll position at...', position);
    sessionStorage.setItem('scrollPosition', position.toString());
  };

  useEffect(() => {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    console.log('Setting position to...', scrollPosition);
    window.scrollTo(0, parseInt(scrollPosition));

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <>{children}</>;
};

const PersistScrollPosition = ({ element }) => <HoldScrollPosition>{element}</HoldScrollPosition>;

export default PersistScrollPosition;
