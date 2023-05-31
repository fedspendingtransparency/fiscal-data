import React, {useEffect, useState} from "react";
const CustomBar = ({bar: { x, y, width, height, color,  key, data}}) => {

  if (key.includes('deficit')) {
    console.log('index:', data.index, 'x:', x, '  y:', y, '  height:', height);
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


  return(
      <rect
        width={width}
        height={pauseAnimation ? height : 0}
        x={x}
        y={pauseAnimation ? y : height + y}
        fill={color}
        focusable={key.includes('deficit')}
        style={{ transition: 'all ' + duration + 's ease-in' } }
      />
  )
};

export default CustomBar;
