/* istanbul ignore file */
import React, { useRef, useEffect, useState } from 'react';
import LineGraph from './lineGraph';

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
console.log('nana', animationRunning);
  return (
    <div
      style={{
        position: 'relative',
        height: '400px',
        maxWidth: '500px',
        width: '100%',
      }}
    >
      <LineGraph />
      <div
        ref={animatedLineRef}
        style={{
          position: 'absolute',
          top: '12%',
          left: '68%',
          width: '0px',
          height: '250px',
          background: 'transparent',
          border: '2px dashed gray',
          transform: 'translateX(-50%)',
          opacity: '0',
          transition: 'opacity 1s ease-in-out',
        }}
      />
    </div>
  );
};
export default LineGraphAnimation;
