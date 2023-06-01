import React, {useEffect, useState} from "react";
const CustomBar = ({bar: { x, y, width, height, color,  key, data}, onMouseEnter, onMouseLeave}) => {

  if (key.includes('deficit')) {
    // console.log(data);
    // console.log('index:', data.index, 'x:', x, '  y:', y, '  height:', height);
  }
  const [pauseAnimation, setPauseAnimation] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPauseAnimation(true);
    }, data.data["delay"] + 500)
  }, [])

  // useEffect(() => {
  //   let observer;
  //   if (typeof window !== "undefined") {
  //     const config = {
  //       rootMargin: '-50% 0% -50% 0%',
  //       threshold: 0
  //     }
  //     observer = new IntersectionObserver(entries => {
  //       entries.forEach((entry) => {
  //         if(entry.isIntersecting) {
  //           setPauseAnimation(false);
  //         }
  //       })
  //     }, config)
  //     setTimeout(() =>
  //       observer.observe(document.querySelector('[data-testid="deficitTrendsChartParent"]')), 1000)
  //   }
  //
  // }, [])

  const duration = data.data["duration"] / 1000;
  let barColor = color;

  const mouseEnter = (data, event) => {
    onMouseEnter(data, event);
    barColor = '#666666';
  }


  return(
    <g onMouseEnter={(event) => mouseEnter(data, event)} onMouseLeave={(event) => {onMouseLeave(data, event)}}>
      <rect
        width={width}
        height={pauseAnimation ? height : 0}
        x={x}
        y={pauseAnimation ? y : height + y}
        fill={color}
        focusable={true}
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
