import React, {useEffect, useState} from "react";
import {animated, useSpring} from "@react-spring/web";
import {
  semiBoldWeight,
  boldWeight,
  fontBodyCopy,
  fontSize_12,
  fontSize_16,
} from "../../../national-deficit.module.scss";
import {getShortForm} from "../../../../../../../utils/rounding-utils";

const CustomBar = ({bar: { x, y, width, height, color,  key, data}}) => {
  const [pauseAnimation, setPauseAnimation ] = useState(true);
  const [opacity, setOpacity] = useState(0);

  // 80 is bar width for desktop
  const desktop = width >= 80;

  const config = {
    mass: 10,
    friction: 10,
    tension: 120,
    clamp: true,
  }

  const props = {
    from: {
      y: height ,
      height: 0,
    },
    to: {
      y: 0,
      height: height
    },
    pause: pauseAnimation
  }

  const springs_Revenue = useSpring({
    ...props,
    config: {
      ...config,
      duration: data.data["revenue_animation_duration"]
    },
    delay: 500

  })

  const springs_Deficit = useSpring({
    ...props,
    config: {
      ...config,
      duration: data.data["deficit_animation_duration"]
    },
    delay: (data.data["revenue_animation_duration"] + 1500)
  })

  const springs_Spending = useSpring({
    ...props,
    config: {
      ...config,
      duration: data.data["spending_animation_duration"]
    },
    delay: (data.data["revenue_deficit_animation_duration"] + 2500)
  })

  let springs;
  let label;
  if (key.includes("revenue")){
    springs = springs_Revenue;
    label = "Revenue";
  } else if (key.includes("deficit")) {
    springs = springs_Deficit;
    label = "Deficit";
  } else {
    springs = springs_Spending;
    label = "Spending";
  }

  const xPosDesktop = data.index ? x + width + 62 : x - 65;
  const yPosDesktop = y + (height / 2) - 5;

  const xPosMobile = data.index ? x + width + 40 : x - 42;
  const yPosMobile = y + (height / 2) - 3;

  const getTextDelay = () => {
    let delay;
    if(key.includes("revenue")) {
      delay = 0;
    } else if(key.includes("deficit")) {
      delay = data.data["revenue_animation_duration"] + 1000;
    }
    else {
      delay = data.data["revenue_deficit_animation_duration"] + 2000;
    }
    return delay;
  }



  const textStyle = {
    fontSize: desktop ? fontSize_16 : fontSize_12,
    fill: fontBodyCopy,
    textAnchor: "middle",
    opacity: opacity,
    transition: "opacity .25s ease-in",
  };

  useEffect(() => {
    let observer;
    if(typeof window !== "undefined") {
      const config = {
        rootMargin: '-50% 0% -50% 0%',
        threshold: 0
      }
      observer = new IntersectionObserver(entries => {
        entries.forEach((entry) => {
          if(entry.isIntersecting) {
            setPauseAnimation(false);
            setTimeout(() => {
              setOpacity(1);
            }, [getTextDelay()])
          }
        })
      }, config)
        observer.observe(document.querySelector('[data-testid="deficitComparisonChart"]'));
    }

  }, [])

    return(
        <>
          <text
            x={desktop ? xPosDesktop : xPosMobile }
            y={desktop ? yPosDesktop : yPosMobile }
            style={{...textStyle}}
          >
            {`$${getShortForm(data.value)}`}
          </text>

          <text
            x={desktop ? xPosDesktop : xPosMobile }
            y={desktop ? yPosDesktop + 25 : yPosMobile + 15 }
            style={{...textStyle, fontWeight: (desktop ? boldWeight : semiBoldWeight) }}
          >
            {`${label}`}
          </text>

          <animated.rect
            width={width}
            height={height}
            x={x}
            y={y}
            fill={color}
            style={{...springs}}
          />
        </>
      )
};

export default CustomBar;
