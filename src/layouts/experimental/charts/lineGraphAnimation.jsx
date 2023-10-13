/* istanbul ignore file */
import React, { useRef, useEffect, useState } from 'react';
import ReLineGraph from './rechartLineGraph';

const LineGraphAnimation = () => {
  const animatedLineRef = useRef(null);
  const [animationRunning, setAnimationRunning] = useState(true);

  useEffect(() => {
    if (!animationRunning) return;
    const animatedLine = animatedLineRef.current;
    let direction = 1;
    let position = 0;

    const moveLine = () => {
      position += direction;
      animatedLine.style.transform = `translateX(${position}px)`;

      if (position >= 100 || position <= 0) {
        direction *= -1;
      }

      requestAnimationFrame(moveLine);
    };

    const fadeIn = () => {
      animatedLine.style.opacity = '1';
    };

    const fadeOut = () => {
      animatedLine.style.opacity = '0';
    };

    setTimeout(() => {
      fadeIn();

      setTimeout(() => {
        fadeOut();
        setAnimationRunning(false);
      }, 5000);
    }, 2000);

    moveLine();
  }, [animationRunning]);

  return (
    <div
      style={{
        position: 'relative',
        height: '400px',
        maxWidth: '500px',
        width: '100%',
        zIndex: 0,
      }}
    >
      <ReLineGraph />
      <div
        ref={animatedLineRef}
        style={{
          position: 'absolute',
          top: '2%',
          left: '68%',
          width: '0px',
          height: '200px',
          background: 'transparent',
          border: '2px dashed gray',
          transform: 'translateX(-50%)',
          opacity: '0',
          transition: 'opacity 1s ease-in-out',
          zIndex: 100,
        }}
      />
    </div>
  );
};
export default LineGraphAnimation;
