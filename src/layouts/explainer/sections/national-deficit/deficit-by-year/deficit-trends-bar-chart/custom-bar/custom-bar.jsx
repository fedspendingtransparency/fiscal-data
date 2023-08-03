import React, {useEffect, useState} from "react";
const CustomBar = ({bar: { x, y, width, height, color,  key, data}, onMouseEnter, onMouseLeave}) => {
  const [pauseAnimation, setPauseAnimation] = useState(true);

  useEffect(() => {
    let observer;
    if (typeof window !== "undefined") {
      const config = {
        rootMargin: '-50% 0% -50% 0%',
        threshold: 0
      }
      observer = new IntersectionObserver(entries => {
        entries.forEach((entry) => {
          if(entry.isIntersecting) {
            setTimeout(() => {
              setPauseAnimation(false);
            }, data.data.delay)
          }
        })
      }, config)
        observer.observe(document.querySelector('[data-testid="deficitTrendsChartParent"]'));
    }

  }, [])

  const duration = data.data.duration / 1000;


  return(
    <g onMouseEnter={(event) => onMouseEnter(data, event)}
       onMouseLeave={(event) => {onMouseLeave(data, event)}}
       data-testid="customBar"
    >
      <rect
        width={width}
        height={pauseAnimation ?0 : height}
        x={x}
        y={pauseAnimation ? height + y : y}
        fill={color}
        style={{ transition: 'y ' + duration + 's ease-in, height ' + duration + 's ease-in' } }
      />
      <rect
        width={width}
        height={y}
        x={x}
        y={0}
        fill={'hsl(0, 0%, 100%, 0.0)'}
      />
    </g>
  )
};

export default CustomBar;
