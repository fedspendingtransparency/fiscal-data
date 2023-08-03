import React, { useEffect, useState } from 'react';

 const CustomSlices = (
  {
    slices,
    data,
    setCurrentSlice,
    groupMouseLeave,
    mouseMove,
    inView,
    duration,
    customAnimationTriggeredOnce,
    setCustomAnimationTriggeredOnce,
  }) => {

  const [style, setStyle] = useState({});
  const [animationTriggeredOnce, setAnimationTriggeredOnce] = useState(false);

  useEffect(() => {
    const animationTriggered = customAnimationTriggeredOnce ? customAnimationTriggeredOnce : animationTriggeredOnce;
    if (inView && data.length && !animationTriggered) {
      setAnimationTriggeredOnce(true);
      if (setCustomAnimationTriggeredOnce) {
        setCustomAnimationTriggeredOnce(true);
      }
      const stepDuration = duration ? duration : 50;

      slices.forEach((slice, index) => {
        setTimeout(() => {
          setCurrentSlice(slice);
          mouseMove(slice);
        }, (stepDuration * index) + 550);
      });

      setTimeout(() => {
        setCurrentSlice(null);
      }, (stepDuration * (slices.length + 1)) + 550);
    }
  }, [inView]);

  return (
    <g data-testid="customSlices"
       onMouseLeave={ () => {
         if (groupMouseLeave) {
           groupMouseLeave();
         }
       }}
    >
      {slices.map((slice, index) => (
        <rect
          key={index}
          x={slice.x0}
          y={slice.y0}
          tabIndex={0}
          width={slice.width}
          height={slice.height}
          strokeWidth={0}
          strokeOpacity={0.25}
          fillOpacity={0}
          style={style}
          onMouseEnter={() => setCurrentSlice(slice)}
          onFocus={() => {
            setStyle({})
            if(mouseMove) {
              mouseMove(slice)
            }
            setCurrentSlice(slice)
          }}
          onMouseMove={() =>{
            setStyle({outline: "none"})
            if(mouseMove) {
              mouseMove(slice)
            }
            setCurrentSlice(slice)}
          }
          onMouseLeave={() => {
            setCurrentSlice(null)
          }}
        />
      ))}
    </g>
  );
};

export default CustomSlices;
